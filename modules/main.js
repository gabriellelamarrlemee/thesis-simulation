console.log('main');

function Main(){
  var m = {t:50,r:50,b:50,l:50},
      raceY = h/2,
      incomeY = h/2,
      neighborhoodY = h/3,
      schoolY = h/2,
      n = 500,
      m = 5,
      degrees = 180/Math.PI,
      selectedRace,
      selectedNode,
      selectedNodeIncome,
      selectedNodeSqNum,
      selectedNodeSqSchool,
      selectionTxt;

  var dispatcher = d3.dispatch('update');
  var profile = Profile();
  var results = Results();
  var detail = Detail();

  // Scales
  var scaleColor = d3.scaleOrdinal()
      .domain(['White','Black','Hispanic'])
      .range(['blue','purple','green']);
  var raceScaleX = d3.scaleOrdinal()
  		.domain(['White','Black','Hispanic']);
  var incomeScaleX = d3.scaleLinear()
  		.domain([0,200000]);
  var neighborhoodScaleX = d3.scaleOrdinal()
      .domain(['A','AB','B','BB','BH','C','CW','D','DW']);


  // Beginning of exports section
  var exports = function(selection){

    var children = selection.datum()[0];
    var schools = selection.datum()[1];
    var dataNested = d3.nest().key(function(d){ return d.schType; }).entries(schools);
    var neighborhoods = dataNested.filter(function(d){ return d.key === 'Public'});

    var w = w || selection.node().clientWidth,
        h = h || selection.node().clientHeight,
        w_main = w,
        // w_main = w*0.80,
        w_sidebar = w*0.15;

    var sidebarSvg = d3.select('#sidebar').append('svg');
    var detailSvg = d3.select('#detail').append('svg').attr('width',w).attr('height',h);
    var mainSvg = selection.append('svg').attr('width',w).attr('height',h);

    var canvas = selection.append('canvas')
      .attr('class','canvas')
      .attr('width',w)
      .attr('height',h);

    var context = canvas.node().getContext('2d');

    var wA = (w_main/12)*2,
        wB = (w_main/12)*3,
        wC = (w_main/12)*4,
        wD = (w_main/12)*5,
        wE = (w_main/12)*6,
        wF = (w_main/12)*7,
        wG = (w_main/12)*8,
        wH = (w_main/12)*9,
        wI = (w_main/12)*10,
        wJ = (w_main/12)*4,
        wK = (w_main/12)*8;

    var nbhdScaleX = d3.scaleOrdinal().domain(['A','B','C','D','E','F','G','H','I']).range([wA,wB,wC,wD,wE,wF,wG,wH,wI]);
    var schoolScaleX = d3.scaleOrdinal().domain(['SchA','SchBB','SchCW','SchAB','SchBH','SchD','SchB','SchC','SchDW','Charter','Private']).range([wA,wB,wC,wD,wE,wF,wG,wH,wI,wJ,wK]);
    var schoolScaleY = d3.scaleOrdinal().domain(['SchA','SchBB','SchCW','SchAB','SchBH','SchD','SchB','SchC','SchDW','Charter','Private']).range([schoolY,schoolY,schoolY,schoolY,schoolY,schoolY,schoolY,schoolY,schoolY,schoolY+50,schoolY+50]);

    // Draw the svg circles
    var nodes = mainSvg.selectAll('.node').data(children)
      .enter().append('g')
      .attr('class','node')
      .attr('transform',function(d){ return 'translate('+ d.x +','+ d.y +')' })
      .on('click',function(d){

        introMovement.stop();
        selectedRace = d.race;
        selectedNode = d3.select(this);
        selectedNodeIncome = selectedNode.data()[0].income;
        selectedNodeEducation = selectedNode.data()[0].education;
        selectedNodeSqNum = selectedNode.data()[0].statusQuoNeighbNum;
        selectedNodeSqSchool = selectedNode.data()[0].statusQuoSchool;


        d3.selectAll('.circle')
          .style('fill',function(d){ return scaleColor(d.race); })
          .attr('opacity',0.2).attr('r',2);

        // Selection text
        introTxtB.style('display','block');
        introTxtB.append('p').attr('class','prompt')
          .text('Your child is ' + selectedRace).style('display','block');

        selectedNode.attr('id','selected');
        selectedNode.select('.circle').style('opacity',1).attr('r',4);
        nodes.on('click',null);
        introTxtA.style('display','none');
        raceBtn.style('display','inline-block');

      });

    nodes.append('circle')
      .attr('r',30)
      .attr('opacity',0.0)
      .style('cursor','pointer');

    nodes.append('circle')
      .attr('class','circle')
      .attr('r',4)
      .style('fill','black')
      .style('cursor','pointer')
      .attr('opacity',0.1);

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
        var data_individual = children[i],
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

    // introMovement.stop();

    // Set up simulation
    var chargeForce = d3.forceManyBody().strength(-1),
        collideForce = d3.forceCollide().radius(6),
        collideForceLarge = d3.forceCollide().radius(function(d){ return (2 * d.education) + 2 }),
        raceXForce = d3.forceX().x(function(d){ return raceScaleX(d.race) }),
        raceYForce = d3.forceY().y(raceY),
        incomeXForce = d3.forceX().x(function(d){ return incomeScaleX(d.income) }).strength(1),
        incomeYForce = d3.forceY().y(incomeY),
        neighborhoodXForce = d3.forceX().x(function(d){ return nbhdScaleX(d.statusQuoNeighb); }),
        neighborhoodYForce = d3.forceY().y(neighborhoodY+50),
        schoolXForce = d3.forceX().x(function(d){ return schoolScaleX(d.statusQuoSchool); }),
        schoolYForce = d3.forceY().y(function(d){ return schoolScaleY(d.statusQuoSchool)+50; });

    // Base simulation
    var simulation = d3.forceSimulation()
      // .force('charge',chargeForce)
      .force('collide',collideForce);
    simulation
      .nodes(children)
      .on('tick',function(){
        nodes
          .attr('transform',function(d){ return 'translate('+ d.x+','+ d.y+')' });
      });

      simulation.stop();

    // School buttons
    // ADD THIS STUFF IN HERE - make the public schools replace the neighborhood button. Show the dots that move and draw the ones that leave in canvas.
    // Public school
    // Charter school
    // Private school



    // ************ TEXT CODE ************

    var textDiv = d3.select('#container');
    var textFull = d3.select('#full');
    var textThird1 = d3.select('#third-1');
    var textThird2 = d3.select('#third-2');
    var textThird3 = d3.select('#third-3');
    var sidebarRace = d3.select('#race');
    var sidebarIncome = d3.select('#income');
    var bottomBtn = d3.select('#bottom-btn');


    // Intro text
    var introTxtA = textFull.append('div').attr('class','txt introA-txt').style('margin-top',200+'px');
    introTxtA.append('p').attr('class','title').text('Educate Your Child');
    introTxtA.append('p').attr('class','body').text('The Chicago public school system (CPS) is the third largest in the country and due to residential and assignment policies, has a high level of school segregation. How can parent choices and policy changes affect the education experience of students?');
    introTxtA.append('p').attr('class','prompt').text('Select a dot to begin');
    var introTxtB = textFull.append('div').attr('class','txt introB-txt').style('margin-top',200+'px').style('display','none');

    // Race button
    var raceBtn = d3.select('#continue-race');
    raceBtn.on('click',function(){
        // Change the width of the main area
        mainSvg.attr('width',w_main).attr('height',h);
        textDiv.style('width',w_main+'px');

        d3.select(this).transition().style('display','none');
        introTxtB.style('display','none');
        incomeBtn.style('display','block');
        raceTxtA.style('display','block');
        raceTxtB.style('display','block');
        raceTxtC.style('display','block');
        raceTxtD.style('display','block');

        raceScaleX.range([(w_main*0.166),(w_main/2),(w_main*0.833)]);
        incomeScaleX.range([w_main/5,(w_main/5)*4]);
        neighborhoodScaleX.range([(w_main/10)*2,(w_main/10)*4,(w_main/10)*6,(w_main/10)*8]);

        d3.select('#sidebar').style('visibility','visible').style('transition','display 2s');

        // Race sidebar text
        var raceSidebarTxt = sidebarRace.append('div').attr('class','txt race-sidebar-txt');
        raceSidebarTxt.append('p').attr('class','body').text(selectedRace);

        simulation
          // .force('charge',null)
          .force('x-race',raceXForce)
          .force('y-race',raceYForce);
        simulation.alpha(1).restart()
          .on('end',function(){
            console.log('end');
          });
        // sidebarSvg.datum(children).call(profile);
      });

    // Race text
    var raceTxtA = textFull.append('div').attr('class','txt race-txt').style('margin-top',200+'px').style('display','none');
    raceTxtA.append('p').attr('class','body').text('Of the city\'s K-8 school-age children:');
    var raceTxtB = textThird1.append('div').style('display','none');
    raceTxtB.append('p').attr('class','body').text('17% are White');
    var raceTxtC = textThird2.append('div').style('display','none');
    raceTxtC.append('p').attr('class','body').text('35% are Black');
    var raceTxtD = textThird3.append('div').style('display','none');
    raceTxtD.append('p').attr('class','body').text('43% are Hispanic');

    // Income button
    var incomeBtn = d3.select('#continue-income');
    incomeBtn.on('click',function(){
        // draw();
        d3.select(this).transition().style('display','none');
        raceTxtA.style('display','none');
        raceTxtB.style('display','none');
        raceTxtC.style('display','none');
        raceTxtD.style('display','none');
        incomeTxt.style('display','block');
        educationBtn.style('display','block');

        // Axis
        var income_X_Axis = d3.axisBottom().scale(incomeScaleX);

        // Add axis
        mainSvg.append('g').attr('class','income-axis').attr('transform','translate('+ 0 +','+ ((h/2)+150) +')').call(income_X_Axis);

        // Income sidebar text
        var incomeSidebarTxt = sidebarSvg.append('g').attr('class','sidebar-text-group income-sidebar-txt');
        incomeSidebarTxt.append('text').attr('class','body').attr('x',w_sidebar/2).attr('y',h/2)
          .text(selectedNodeIncome);

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

    // Income text
    var incomeTxt = textFull.append('div').attr('class','txt income-txt').style('margin-top',200+'px').style('display','none');
    incomeTxt.append('p').attr('class','body').text('Median household income is $XX,XXX. For white households it is $75,416. For Hispanic households, it is $43,530. For black households, it is $30,193.');

    // Education button
    var educationBtn = d3.select('#continue-education');
    educationBtn.on('click',function(){

        d3.selectAll('.circle').transition().attr('r',function(d){ return 2 * d.education });

        d3.select(this).transition().style('display','none');
        incomeTxt.style('display','none');
        neighborhoodBtn.style('display','block');
        educationTxt.style('display','block');

        simulation
          .force('collide',null)
          .force('collide-null',collideForceLarge);

        simulation.alpha(1).restart()
          .on('end',function(){
            console.log('end');
          });

      });

    // Education text
    var educationTxt = textFull.append('div').attr('class','txt education-txt').style('margin-top',200+'px').style('display','none');
    educationTxt.append('p').attr('class','body').text('[Description about education readiness based on income and ability to pass entrance exams.]');

    // Neighborhood buttons
    var neighborhoodBtn = d3.select('#continue-neighborhood');
    neighborhoodBtn.on('click',function(){

        d3.select(this).transition().style('display','none');
        educationTxt.style('display','none');
        d3.select('.income-axis').transition().style('display','none');
        nodes.transition().style('visibility','hidden');
        neighborhoodTxt.style('display','block');
        createNeighborhoodBtns();

      });

    // Neighborhood text
    var neighborhoodTxt = textFull.append('div').attr('class','txt neighborhood-txt').style('margin-top',60+'px').style('display','none');
    neighborhoodTxt.append('p').attr('class','body').text('Based on your income, these types of neighborhoods are available to you.');
    neighborhoodTxt.append('p').attr('class','prompt').text('Choose a neighborhood to live in.');

    var createNeighborhoodBtns = function(){

      // Draw the neighborhood buttons
      var nbhds = mainSvg.selectAll('.nbhd-group').data(neighborhoods[0].values)
        .enter().append('g').attr('class','nbhd-group')
        .attr('transform',function(d){ return 'translate('+ nbhdScaleX(d.alias) +','+ neighborhoodY +')' })
        .on('click',function(d){ if(selectedNodeSqNum >= d.sqNum){
          neighborhoodTxt.style('display','none');
          schoolTxt.style('display','block');
          nodes.transition().style('visibility','visible');
          simulation
            .force('x-income',null)
            .force('y-income',null)
            .force('x-neighborhood',neighborhoodXForce)
            .force('y-neighborhood',neighborhoodYForce);
          simulation.alpha(1).restart()
            .on('end',function(){ console.log('end'); });
          createSchoolBtns();
        }})
        .on('mouseenter',function(d){ if(selectedNodeSqNum >= d.sqNum){
            var description = d3.select('#'+d.alias+'-description');
            description.transition().style('opacity',1);
        }})
        .on('mouseleave',function(d){ if(selectedNodeSqNum >= d.sqNum){
            var description = d3.select('#'+d.alias+'-description');
            description.transition().style('opacity',0);
        }});

      console.log(selectedNodeSqNum);
      // *** NEED TO UPDATE THE SELECTED NODE'S NEIGHBORHOOD TO THE NEIGHBORHOOD CHOICE - SHOULD HAPPEN BEFORE SIMULATION ***

      nbhds.append('circle').attr('class','nbhd').style('r',20).style('fill','#cccccc')
        .style('opacity',function(d){ if(selectedNodeSqNum >= d.sqNum){ return 1; } else { return 0.2; } });
      nbhds.append('text').text(function(d){ return d.alias; }).attr('class','label')
        .attr('x',0).attr('dy','.35em').attr('text-anchor','middle').style('fill','#ffffff');
      nbhds.append('text').text(function(d){ return d.sqNeighbDescr; }).attr('class','body').attr('id',function(d){ return d.alias +'-description'; })
        .attr('x',-10).attr('y',50).style('text-anchor','middle').style('opacity',0);

    }

    // School text
    var schoolTxt = textFull.append('div').attr('class','txt school-txt').style('margin-top',60+'px').style('display','none');
    schoolTxt.append('p').attr('class','body').text('Each neighborhood has an assigned neighborhood public school. You can choose to remain in your public school or, if you have the income and your child can pass the entrance exam, you can choose a charter/selective school or private school.');
    schoolTxt.append('p').attr('class','prompt').text('Choose an elementary school for your child.');

    var createSchoolBtns = function(){

      // ...or if income level is high enough or if school label is charter

      // Draw the school buttons
      var schls = mainSvg.selectAll('.school-group').data(schools)
        .enter().append('g').attr('class','school-group')
        .attr('transform',function(d){ return 'translate('+ schoolScaleX(d.actual) +','+ schoolScaleY(d.actual) +')'})
        .on('click',function(d){
          console.log(d.actual);
          console.log(selectedNodeSqSchool);
          // neighborhoodTxt.style('display','none');
          // schoolTxt.style('display','block');
          simulation
            .force('x-neighborhood',null)
            .force('y-neighborhood',null)
            .force('x-school',schoolXForce)
            .force('y-school',schoolYForce);
          simulation.alpha(1).restart()
            .on('end',function(){ console.log('end'); });
        })
        .on('mouseenter',function(d){ if(selectedNodeSqSchool == d.actual){
            // var description = d3.select('#'+d.alias+'-description');
            // description.transition().style('opacity',1);
            // console.log(d.sqNum);
        }})
        .on('mouseleave',function(d){ if(selectedNodeSqSchool == d.actual){
            // var description = d3.select('#'+d.alias+'-description');
            // description.transition().style('opacity',0);
        }});

      schls.append('circle').attr('class','school').style('r',20).style('fill','#cccccc')
        .style('opacity',function(d){
          if(selectedNodeSqSchool == d.actual){ return 1; }
            else if (selectedNodeIncome >= 60000){ return 1; }
              else if (d.actual == 'Charter'){ return 1; }
                else{ return 0.2; }
          });
      schls.append('text').text(function(d){ return d.letter; }).attr('class','label')
        .attr('x',0).attr('dy','.35em').attr('text-anchor','middle').style('fill','#ffffff');
      // schools.append('text').text(function(d){ return d.sqNeighbDescr; }).attr('class','body').attr('id',function(d){ return d.alias +'-description'; })
      //   .attr('x',-10).attr('y',50).style('text-anchor','middle').style('opacity',0);


    }

  // context.clearRect(0, 0, width, height); // Clear the canvas.

  }

  return exports;

}
