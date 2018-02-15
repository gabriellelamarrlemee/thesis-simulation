
// Set up a drawing environment
var m = {t:50,r:50,b:50,l:50};
var outerWidth = document.getElementById('container').clientWidth,
    outerHeight = window.innerHeight,
    w = outerWidth, // - m.l - m.r,
    h = outerHeight, // - m.t - m.b,
    raceY = h/2,
    incomeY = h/2,
    neighborhoodY = h/3,
    n = 500,
    m = 5,
    degrees = 180/Math.PI,
    selectedRace,
    selectedNode,
    selectedNodeIncome,
    selectionTxt;

var canvas = d3.select('#container')
  .append('canvas')
  .attr('class','canvas')
  .attr('width',w)
  .attr('height',h)
  .attr('margin-left',m.l)
  .attr('margin-top',m.t);

var context = canvas.node().getContext('2d');

var svg = d3.select('#container')
  .append('svg')
  .attr('width',w)
  .attr('height',h)
  .append('g');


// Scales
var scaleColor = d3.scaleOrdinal()
    .domain(['White','Black','Hispanic'])
    .range(['blue','purple','green']);
var raceScaleX = d3.scaleOrdinal()
		.domain(['White','Black','Hispanic'])
		.range([w/6,(w/2),(w/6)*5]);
var incomeScaleX = d3.scaleLinear()
		.domain([0,130000])
		.range([w/5,(w/5)*4]);
var neighborhoodScaleX = d3.scaleOrdinal()
    .domain(['A','B','C','D'])
    .range([(w/10)*2,(w/10)*4,(w/10)*6,(w/10)*8]);

// Axis
var income_X_Axis = d3.axisBottom().scale(incomeScaleX);



// ************ IMPORT DATA ************
d3.queue()
	.defer(d3.csv,'./data/WorkingChildData.csv',parseData)
	.defer(d3.json,'./data/cps_attendance_zones.json')
	.await(dataLoaded);

function dataLoaded(err, data, mapData){


  // Draw the svg circles
  var nodes = svg.selectAll('.node')
    .data(data)
    .enter().append('g')
    .attr('class','node')
    .attr('transform',function(d){ return 'translate('+ d.x +','+ d.y +')' })
    .on('click',function(d){

      introMovement.stop();
      selectedRace = d.race;
      selectedNode = d3.select(this);
      selectedNodeIncome = selectedNode.data()[0].income;

      d3.selectAll('.circle')
        .style('fill',function(d){ return scaleColor(d.race); })
        .attr('opacity',0.2);

      selectedNode.attr('id','selected');
      selectedNode.select('.circle').style('opacity',1);
      nodes.on('click',null);
      introTxt.style('visibility','hidden');
      raceBtn.style('visibility','visible');

      // Selection text
      selectionTxt = svg.append('g').attr('class','text-group selection-txt')
        .attr('transform','translate('+w/2+','+h/2+')')
      selectionTxt.append('text').text('Your child is ' + selectedRace)
        .attr('class','prompt').attr('y',0);

    });

  nodes.append('circle')
    .attr('r',30)
    .attr('opacity',0.0)
    .style('cursor','pointer');

  nodes.append('circle')
    .attr('class','circle')
    .attr('r',2)
    .style('fill','black')
    .style('cursor','pointer')
    .attr('opacity',0.4);

  nodes.append('path')
    .datum(function(d) { return d.path.slice(0, 3); })
    .attr("class", "mid");

  // Draw the canvas circle
  function draw() {
    nodes.each(function(d,i){
      var canvasNode = d3.select(this);
      context.fillStyle = canvasNode.attr('fill');
      context.globalAlpha = canvasNode.attr('opacity');
      context.beginPath();
      context.arc(canvasNode.attr('cx'), canvasNode.attr('cy'), canvasNode.attr('r'), 0, Math.PI*2);
      context.fill();
    })
  }


  // Make intro dots move around
  var introMovement = d3.timer(function() {
    for (var i = -1; ++i < n;) {
      var data_individual = data[i],
          path = data_individual.path,
          dx = data_individual.vx,
          dy = data_individual.vy,
          x = path[0][0] += dx,
          y = path[0][1] += dy,
          // speed = Math.sqrt(dx * dx + dy * dy),
          speed = 0.00001,
          count = speed * 1,
          k1 = -5 - speed / 3;

      // Bounce off the screen edges
      if (x < 0 || x > w) data_individual.vx *= -1;
      if (y < 0 || y > h) data_individual.vy *= -1;

      // Move
      for (var j = 0; ++j < m;) {
        var vx = x - path[j][0],
            vy = y - path[j][1],
            k2 = Math.sin(((data_individual.count += count) + j * 3) / 3000) / speed;
        path[j][0] = (x += dx / speed * k1) - dy * k2;
        path[j][1] = (y += dy / speed * k1) + dx * k2;
        speed = Math.sqrt((dx = vx) * dx + (dy = vy) * dy);
      }
    }

    nodes.attr("transform", nodeTransform);

  });

  function nodeTransform(d) { return "translate(" + d.path[0] + ")"; }


  // Set up simulation
  var chargeForce = d3.forceManyBody().strength(-4),
      collideForce = d3.forceCollide().radius(4),
      collideForceLarge = d3.forceCollide().radius(function(d){ return (2 * d.education) + 2 }),
      introXForce = d3.forceX().x(w/2),
      introYForce = d3.forceY().y(h/2),
      raceXForce = d3.forceX().x(function(d){ return raceScaleX(d.race) }),
      raceYForce = d3.forceY().y(raceY),
      incomeXForce = d3.forceX().x(function(d){ return incomeScaleX(d.income) }),
      incomeYForce = d3.forceY().y(incomeY),
      neighborhoodXForce = d3.forceX().x(function(d){ return neighborhoodScaleX(d.zone) }),
      neighborhoodYForce = d3.forceY().y(neighborhoodY);

  // Intro simulation
  var simulation = d3.forceSimulation()
    .force('charge',chargeForce)
    // .force('x-intro',introXForce)
    // .force('y-intro',introYForce)
    .force('collide',collideForce);
  simulation
    .nodes(data)
    .on('tick',function(){
      nodes
        .attr('transform',function(d){ return 'translate('+ d.x+','+ d.y+')' });
    });

    simulation.stop();


  // ************ BUTTON CODE ************

  // Race button
  var raceBtn = svg.append('g').attr('class','button-group race-btn')
    .attr('width',360).attr('height',40)
    .attr('transform','translate('+((w/2)-180)+','+h/2+')')
    .style('visibility','hidden').style('cursor','pointer');
  raceBtn.append('rect').attr('class','button-rect')
    .attr('x',0).attr('y',100)
    .attr('width',360).attr('height',40);
  raceBtn.append('text').attr('class','button-text')
    .text('See the make-up of the city\'s school-age population.' )
    .attr('x',180).attr('y',120);
  raceBtn
    .on('click',function(){

      d3.select(this).transition().style('visibility','hidden');
      selectionTxt.style('visibility','hidden');
      introTxt.style('visibility','hidden');
      incomeBtn.style('visibility','visible');
      raceTxt.style('visibility','visible');

      simulation
        // .force('charge',null)
        .force('x-race',raceXForce)
        .force('y-race',raceYForce);

      simulation.alpha(1).restart()
        .on('end',function(){
          console.log('end');
        });

    });

  // Income button
  var incomeBtn = svg.append('g').attr('class','button-group income-btn')
    .attr('width',240).attr('height',40)
    .attr('transform','translate('+((w/2)-120)+','+(h-100)+')')
    .style('visibility','hidden').style('cursor','pointer');
  incomeBtn.append('rect').attr('class','button-rect')
    .attr('x',0).attr('y',0)
    .attr('width',240).attr('height',40);
  incomeBtn.append('text').attr('class','button-text')
    .text('What is your household income?')
    .attr('x',120).attr('y',20);
  incomeBtn
    .on('click',function(){

      // draw();
      d3.select(this).transition().style('visibility','hidden');
      raceTxt.style('visibility','hidden');
      incomeTxt.style('visibility','visible');
      educationBtn.style('visibility','visible');

      // Add axis
      svg.append('g').attr('class','income-axis')
        .attr('transform','translate('+ 0 +','+ ((h/2)+150) +')').call(income_X_Axis);

      simulation
        .force('x-race',null)
        .force('y-race',null)
        .force('charge',null)
        .force('x-income',incomeXForce)
        .force('y-income',incomeYForce);

      simulation.alpha(1).restart()
        .on('end',function(){
          console.log('end');
        });

    });

  // Education button
  var educationBtn = svg.append('g').attr('class','button-group education-btn')
    .attr('width',300).attr('height',40)
    .attr('transform','translate('+((w/2)-150)+','+(h-100)+')')
    .style('visibility','hidden').style('cursor','pointer');
  educationBtn.append('rect').attr('class','button-rect')
    .attr('x',0).attr('y',0)
    .attr('width',300).attr('height',40);
  educationBtn.append('text').attr('class','button-text')
    .text('What is your child\'s educational readiness?')
    .attr('x',150).attr('y',20);
  educationBtn
    .on('click',function(){

      d3.selectAll('.circle').transition().attr('r',function(d){ return 2 * d.education });

      d3.select(this).transition().style('visibility','hidden');
      incomeTxt.style('visibility','hidden');
      neighborhood_Choice_Btn.style('visibility','visible');
      educationTxt.style('visibility','visible');

      simulation
        .force('collide',null)
        .force('collide-null',collideForceLarge);

      simulation.alpha(1).restart()
        .on('end',function(){
          console.log('end');
        });

    });

  // Neighborhood buttons
  var neighborhood_Choice_Btn = svg.append('g').attr('class','button-group neighborhood-choice-btn')
    .attr('width',240).attr('height',40)
    .attr('transform','translate('+((w/2)-120)+','+(h-100)+')')
    .style('visibility','hidden').style('cursor','pointer');
  neighborhood_Choice_Btn.append('rect').attr('class','button-rect')
    .attr('x',0).attr('y',0)
    .attr('width',240).attr('height',40);
  neighborhood_Choice_Btn.append('text').attr('class','button-text')
    .text('See your neighborhood options.')
    .attr('x',120).attr('y',20);
  neighborhood_Choice_Btn
    .on('click',function(){

      d3.select(this).transition().style('visibility','hidden');
      educationTxt.style('visibility','hidden');
      d3.select('.income-axis').transition().style('visibility','hidden');
      nodes.transition().style('visibility','hidden');
      neighborhoodTxt.style('visibility','visible');
      // neighborhoodA_Btn.style('visibility','visible');
      // neighborhoodB_Btn.style('visibility','visible');
      // neighborhoodC_Btn.style('visibility','visible');
      // neighborhoodD_Btn.style('visibility','visible');
      createNeighborhoodBtns();

    });

  var createNeighborhoodBtns = function(){

    var neighborhoodA_Btn = svg.append('g').attr('class','button-group neighborhood-btn')
      .attr('width',40).attr('height',40)
      .attr('transform','translate('+((w/10)*2)+','+(h/3)+')')
      .style('opacity',0.3);
    neighborhoodA_Btn.append('rect').attr('class','button-rect')
      .attr('x',0).attr('y',0)
      .attr('width',40).attr('height',40);
    neighborhoodA_Btn.append('text').attr('class','button-text')
      .text('A')
      .attr('x',20).attr('y',20);

    console.log(selectedNodeIncome);

    if(selectedNodeIncome >= 0){
      console.log(selectedNodeIncome)
      neighborhoodA_Btn.style('opacity',1).style('cursor','pointer');
      neighborhoodA_Btn
        .on('click',function(){
              d3.select(this).transition().style('visibility','hidden');
              nodes.transition().style('visibility','visible');
              simulation
                .force('x-income',null)
                .force('y-income',null)
                .force('x-neighborhood',neighborhoodXForce)
                .force('y-neighborhood',neighborhoodYForce);
              simulation.alpha(1).restart()
                .on('end',function(){
                  console.log('end');
                });
              schoolTxt.style('visibility','visible');
        });
    }


    var neighborhoodB_Btn = svg.append('g').attr('class','button-group neighborhood-btn')
      .attr('width',40).attr('height',40)
      .attr('transform','translate('+((w/10)*4)+','+(h/3)+')')
      .style('opacity',0.3);
    neighborhoodB_Btn.append('rect').attr('class','button-rect')
      .attr('x',0).attr('y',0)
      .attr('width',40).attr('height',40);
    neighborhoodB_Btn.append('text').attr('class','button-text')
      .text('B')
      .attr('x',20).attr('y',20);

    if(selectedNodeIncome >= 90000){
      neighborhoodB_Btn.style('opacity',1).style('cursor','pointer');
      neighborhoodB_Btn
        .on('click',function(){
              d3.select(this).transition().style('visibility','hidden');
              nodes.transition().style('visibility','visible');
              simulation
                .force('x-income',null)
                .force('y-income',null)
                .force('x-neighborhood',neighborhoodXForce)
                .force('y-neighborhood',neighborhoodYForce);
              simulation.alpha(1).restart()
                .on('end',function(){
                  console.log('end');
                });
              schoolTxt.style('visibility','visible');
        });
    }


    var neighborhoodC_Btn = svg.append('g').attr('class','button-group neighborhood-btn')
      .attr('width',40).attr('height',40)
      .attr('transform','translate('+((w/10)*6)+','+(h/3)+')')
      .style('opacity',0.3);
    neighborhoodC_Btn.append('rect').attr('class','button-rect')
      .attr('x',0).attr('y',0)
      .attr('width',40).attr('height',40);
    neighborhoodC_Btn.append('text').attr('class','button-text')
      .text('C')
      .attr('x',20).attr('y',20);

    if(selectedNodeIncome >= 130000){
      neighborhoodC_Btn.style('opacity',1).style('cursor','pointer');
      neighborhoodC_Btn
        .on('click',function(){
              d3.select(this).transition().style('visibility','hidden');
              nodes.transition().style('visibility','visible');
              simulation
                .force('x-income',null)
                .force('y-income',null)
                .force('x-neighborhood',neighborhoodXForce)
                .force('y-neighborhood',neighborhoodYForce);
              simulation.alpha(1).restart()
                .on('end',function(){
                  console.log('end');
                });
              schoolTxt.style('visibility','visible');
        });
    }


    var neighborhoodD_Btn = svg.append('g').attr('class','button-group neighborhood-btn')
      .attr('width',40).attr('height',40)
      .attr('transform','translate('+((w/10)*8)+','+(h/3)+')')
      .style('opacity',0.3);
    neighborhoodD_Btn.append('rect').attr('class','button-rect')
      .attr('x',0).attr('y',0)
      .attr('width',40).attr('height',40);
    neighborhoodD_Btn.append('text').attr('class','button-text')
      .text('D')
      .attr('x',20).attr('y',20);

    if(selectedNodeIncome >= 180000){
      neighborhoodD_Btn.style('opacity',1).style('cursor','pointer');
      neighborhoodD_Btn
        .on('click',function(){
              d3.select(this).transition().style('visibility','hidden');
              nodes.transition().style('visibility','visible');
              simulation
                .force('x-income',null)
                .force('y-income',null)
                .force('x-neighborhood',neighborhoodXForce)
                .force('y-neighborhood',neighborhoodYForce);
              simulation.alpha(1).restart()
                .on('end',function(){
                  console.log('end');
                });
              schoolTxt.style('visibility','visible');
        });
    }
  }

  // School buttons
  // ADD THIS STUFF IN HERE - make the public schools replace the neighborhood button. Show the dots that move and draw the ones that leave in canvas.
  // Public school
  // Charter school
  // Private school



  // ************ TEXT CODE ************

  // Intro text
  var introTxt = svg.append('g').attr('class','text-group intro-txt')
    .attr('transform','translate('+w/2+','+h/2+')');
  introTxt.append('text').attr('class','title')
    .text('Educate Your Child').attr('y',-40);
  introTxt.append('text').attr('class','body')
    .text('[Description]').attr('y',0);
  introTxt.append('text').attr('class','prompt')
    .text('Select a dot to begin').attr('y',50);

  // Race text
  var raceTxt = svg.append('g').attr('class','text-group race-txt')
    .attr('transform','translate('+w/2+','+h/4+')')
    .style('visibility','hidden');
  raceTxt.append('text').attr('class','body')
    .text('Of the city\'s school-age children:');
  raceTxt.append('text').attr('class','body')
    .attr('x',-((w/2)-(w/6))).attr('y',70).text('XX% are White');
  raceTxt.append('text').attr('class','body')
    .attr('x',0).attr('y',70).text('XX% are Black');
  raceTxt.append('text').attr('class','body')
    .attr('x',(((w/6)*5))-(w/2)).attr('y',70).text('XX% are Hispanic');

  // 		.range([w/6,(w/2),(w/6)*5]);

  // Income text
  var incomeTxt = svg.append('g').attr('class','text-group income-txt')
    .attr('transform','translate('+w/2+','+50+')')
    .style('visibility','hidden');
  incomeTxt.append('text').attr('class','body')
    .text('[Description about median income for each group, costs in the city, and ability to afford private school/tutors.]');

  // Education text
  var educationTxt = svg.append('g').attr('class','text-group education-txt')
    .attr('transform','translate('+w/2+','+50+')')
    .style('visibility','hidden');
  educationTxt.append('text').attr('class','body')
    .text('[Description about education readiness based on income and ability to pass entrance exams.]');

  // Neighborhood text
  var neighborhoodTxt = svg.append('g').attr('class','text-group neighborhood-txt')
    .attr('transform','translate('+w/2+','+50+')').style('visibility','hidden');
  neighborhoodTxt.append('text').attr('class','body')
    .text('Based on your income, these types of neighborhoods are available to you.');
  neighborhoodTxt.append('text').attr('class','prompt'),attr('y',60)
    .text('Choose a neighborhood to live in.');
  neighborhoodTxt.append('text').attr('class','body')
    .attr('x',-((w/2)-(w/6))).attr('y',h/2).text('[Neighborhood description]');
  neighborhoodTxt.append('text').attr('class','body')
    .attr('x',0).attr('y',h/2).text('[Neighborhood description]');
  neighborhoodTxt.append('text').attr('class','body')
    .attr('x',(((w/6)*5))-(w/2)).attr('y',h/2).text('[Neighborhood description]');
  neighborhoodTxt.append('text').attr('class','body')
    .attr('x',(((w/6)*5))-(w/2)).attr('y',h/2).text('[Neighborhood description]');

    //    .range([(w/10)*2,(w/10)*4,(w/10)*6,(w/10)*8]);

  // School text
  var schoolTxt = svg.append('g').attr('class','text-group school-txt')
    .attr('transform','translate('+w/2+','+60+')')
    .style('visibility','hidden');
  schoolTxt.append('text').attr('class','body')
    .text('Each neighborhood has an assigned neighborhood public school. You can choose to remain in your public school or, if you have the income and your child can pass the entrance exam, you can choose a charter/selective school or private school.');
  schoolTxt.append('text').attr('class','prompt')
    .text('Choose an elementary school for your child.');


// context.clearRect(0, 0, width, height); // Clear the canvas.

}


function parseData(d){
	return {
		object_id: d.Object_ID,
		race: d.Race,
		income: +d.Income,
    education: d.Education,
    zone: d.Zone,
    x: w * Math.random(),
		y: h * Math.random(),
    vx: Math.random() * 2 - 1,
    vy: Math.random() * 2 - 1,
    path: d3.range(m).map(function() { return [w * Math.random(), h * Math.random()]; }),
    count: 0
	}
}
