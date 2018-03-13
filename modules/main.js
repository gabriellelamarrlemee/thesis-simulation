console.log('main');

function Main(){
  var m = {t:50,r:50,b:50,l:50},
      raceY = h*0.45,
      incomeY = h*0.45,
      neighborhoodY = h/4,
      schoolY = h*0.45,
      textY = h/10,
      n = 500,
      m = 5,
      neighborhoodSegregation,
      degrees = 180/Math.PI,
      selectedRace,
      selectedNode,
      selectedNodeEducation,
      selectedNodeIncome,
      selectedNodeSqNum,
      selectedNodeLiNum,
      selectedNodeSqSchool,
      selectionTxt,
      schls,
      incomeGraph,
      nodeReadiness;

  var dispatcher = d3.dispatch('update');
  var profile = Profile();
  var results = Results();

  // Scales
  var scaleColor = d3.scaleOrdinal().domain(['White','Black','Hispanic']).range(['blue','purple','green']);
  var raceScaleX = d3.scaleOrdinal().domain(['White','Black','Hispanic']);
  var incomeScaleX = d3.scaleLinear().domain([0,200000]);
  var readinessScale = d3.scaleOrdinal().domain([1,2]).range([0.7,0.2]);
  var readinessScaleY = d3.scaleOrdinal().domain([1,2]).range([incomeY-25,incomeY+25]);
  var incomeScaleY = d3.scaleOrdinal().domain(['White','Black','Hispanic']).range([incomeY-75,incomeY,incomeY+75]);

  // Axis
  var income_X_Axis = d3.axisBottom().scale(incomeScaleX).tickFormat(d3.format('$,'));

  // Mapping
  var projection = d3.geoAlbersUsa(),
      projectionPath = d3.geoPath().projection(projection);



  //  ************ BEGINNING OF EXPORTS SECTION ************
  var exports = function(selection){

    var children = selection.datum()[0];
    var schools = selection.datum()[1];
    var population = selection.datum()[2];
    var map = selection.datum()[3];
    var schoolsNested = d3.nest().key(function(d){ return d.schType; }).entries(schools);
    var neighborhoods = schoolsNested.filter(function(d){ return d.key === 'Public'});
    var mapNested = d3.nest().key(function(d){ return d.properties.value; }).entries(map.features);

    console.log(mapNested);


    // console.log(map);

    var w = w || selection.node().clientWidth,
        h = h || selection.node().clientHeight,
        w_sidebar = w*0.15;

    var sidebarSvg = d3.select('#sidebar').append('svg').attr('position','fixed');
    var mainSvg = selection.append('svg').attr('width',w).attr('height',h);

    var canvas = selection.append('canvas')
      .attr('class','canvas')
      .attr('width',w)
      .attr('height',h);

    var context = canvas.node().getContext('2d');
    context.clearRect(0, 0, w, h); // Clear the canvas.

    // Neighborhood placement
    var col1 = (w/12)*2,
        col2 = (w/12)*4,
        col3 = (w/12)*6,
        col4 = (w/12)*8,
        row1 = (h*0.27),
        row2 = (h*0.47),
        row3 = (h*0.67);

    var nbhdScaleX = d3.scaleOrdinal().domain(['1','2','3','4','5','6','7','8','9'])
      .range([col1,col2,col3,col1,col2,col3,col1,col2,col3]);
    var nbhdScaleY = d3.scaleOrdinal().domain(['1','2','3','4','5','6','7','8','9'])
      .range([row1,row1,row1,row2,row2,row2,row3,row3,row3]);
    var schoolScaleX = d3.scaleOrdinal().domain(['SchAB','SchA','SchBH','SchBB','SchB','SchC','SchCW','SchD','SchDW','Charter','Private'])
      .range([col1,col2,col3,col1,col2,col3,col1,col2,col3,col4,col4]);
    var schoolScaleY = d3.scaleOrdinal().domain(['SchAB','SchA','SchBH','SchBB','SchB','SchC','SchCW','SchD','SchDW','Charter','Private'])
      .range([row1,row1,row1,row2,row2,row2,row3,row3,row3,row2,row3]);

    // Map projection
    projection.fitExtent([[w*0.65,h*0.25],[w*0.95,h*0.7]],map);


    // ************ DRAW NODES ************
    var nodes = mainSvg.selectAll('.node').data(children)
      .enter().append('g')
      .attr('class','node')
      .attr('transform',function(d){ return 'translate('+ d.x +','+ d.y +')' })
      .on('click',function(d){

        introMovement.stop();
        selectedRace = d.race;
        selectedNode = d3.select(this);
        selectedNodeIncome = selectedNode.data()[0].income;
        selectedNodeEducation = selectedNode.data()[0].readiness;
        selectedNodeSqNum = selectedNode.data()[0].statusQuoNeighbNum;
        selectedNodeSqSchool = selectedNode.data()[0].statusQuoSchool;
        selectedNodeLiNum = selectedNode.data()[0].LIHNeighbNum;
        nodeReadiness = selectedNodeEducation === 1 ? 'ready' : 'not ready';

        console.log(selectedNodeIncome);
        console.log(selectedNode.data()[0]);


        // console.log(selectedNode.datum());

        d3.selectAll('.circle')
          .style('fill',function(d){ return scaleColor(d.race); })
          .style('opacity',0.3).attr('r',2);
        d3.selectAll('.outer')
          .attr('r',7);

        // Selection text
        introTxtB.style('display','block');
        introTxtB.append('p').attr('class','prompt')
          .text('Your child is ' + selectedRace).style('display','block');

        selectedNode.select('.circle').style('opacity',1).attr('r',4);
        nodes.on('click',null);
        introTxtA.style('display','none');
        raceBtn.style('display','inline-block');

      });

    nodes.append('circle')
      .attr('class','outer')
      .attr('r',30)
      .attr('opacity',0.0)
      .style('cursor','pointer')
      .on('click',function(d){
        // console.log(d.statusQuoNeighb);
        // console.log(d.statusQuoNeighbNum);
      });

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
      d3.selectAll('.circle').each(function(d,i){
        var contextNode = d3.select(this);
        context.fillStyle = contextNode.style('fill');
        context.globalAlpha = contextNode.style('opacity');
        context.beginPath();
        context.arc(this.getCTM().e, this.getCTM().f, contextNode.attr('r'), 0, Math.PI*2);
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
        raceXForce = d3.forceX().x(function(d){ return raceScaleX(d.race) }),
        raceYForce = d3.forceY().y(raceY),
        incomeXForce = d3.forceX().x(function(d){ return incomeScaleX(d.income) }).strength(1),
        incomeYForce = d3.forceY().y(function(d){ return incomeScaleY(d.race) }),
        schoolXForce = d3.forceX().x(function(d){ return schoolScaleX(d.statusQuoSchool); }),
        schoolYForce = d3.forceY().y(function(d){ return schoolScaleY(d.statusQuoSchool)+75; });
        readinessYForce = d3.forceY().y(function(d){ return readinessScaleY(d.readiness)+h*0.025; });

    // Base simulation
    var simulation = d3.forceSimulation()
      .force('collide',collideForce);

    simulation
      .nodes(children)
      .on('tick',function(){
        nodes
          .attr('transform',function(d){ return 'translate('+ d.x+','+ d.y+')' });
      });

      simulation.stop();

      function isolate(force, filter) {
        var initialize = force.initialize;
        force.initialize = function(){ initialize.call(force, children.filter(filter)); };
        return force;
      }


    // ************ TEXT & BUTTON CODE ************

    var textDiv = d3.select('#container'),
        textFull = d3.select('#full'),
        textThird1 = d3.select('#third-1'),
        textThird2 = d3.select('#third-2'),
        textThird3 = d3.select('#third-3'),
        sidebarRace = d3.select('#race'),
        sidebarIncome = d3.select('#income'),
        resPolicyButtons = d3.select('#residential-policy-buttons'),
        schoolPolicyButtons = d3.select('#assignment-policy-buttons'),
        learnMoreRace = d3.select('#learn-more-race'),
        learnMoreRes = d3.select('#learn-more-residence'),
        learnMoreSchool = d3.select('#learn-more-school');

    learnMoreRace.on('click',function(){
      d3.select('#detail-pop').style('visibility','visible');
      d3.select(this).transition().style('display','none');
      d3.select('#sidebar').style('visibility','hidden');
      incomeBtn.style('visibility','hidden');
    });

    learnMoreRes.on('click',function(){
      d3.select('#detail-res').style('visibility','visible');
      d3.select(this).transition().style('display','none');
    });

    learnMoreSchool.on('click',function(){
      d3.select('#detail-school').style('visibility','visible');
      d3.select(this).transition().style('display','none');
    });


    // Intro text
    var introTxtA = textFull.append('div').attr('class','txt introA-txt').style('margin-top',h*0.33+'px');
    introTxtA.append('p').attr('class','title').text('Educate Your Child');
    introTxtA.append('p').attr('class','body').text('The Chicago public school system, third largest in the country has a high level of school segregation. You are a parent of a 5 year old child in the city and now you have to make some school decisions. Explore how parent choices and policy changes can affect the educational experience of students?');
    introTxtA.append('p').attr('class','prompt').text('Select a dot to begin');
    var introTxtB = textFull.append('div').attr('class','txt introB-txt').style('margin-top',h*0.45+'px').style('display','none');

    // Race button
    var raceBtn = d3.select('#continue-race');
    raceBtn.on('click',function(){
        // Change the width of the main area
        mainSvg.attr('width',w).attr('height',h);
        textDiv.style('width',w+'px');

        d3.select(this).transition().style('display','none');
        introTxtB.style('display','none');
        incomeBtn.style('display','block');
        raceTxtA.style('display','block');
        raceTxtB.style('display','block');
        raceTxtC.style('display','block');
        raceTxtD.style('display','block');
        learnMoreRace.style('display','block');

        raceScaleX.range([(w*0.166),(w/2),(w*0.833)]);
        incomeScaleX.range([w/5,(w/5)*4]);

        d3.select('#sidebar').style('visibility','visible').style('transition','display 2s');

        // Race sidebar text
        d3.select('.profile-race').html(selectedRace);
        d3.select('#change-race').style('visibility','visible');


        simulation
          .force('x-race',raceXForce)
          .force('y-race',raceYForce);
        simulation.alpha(1).restart()
          .on('end',function(){
            console.log('end');
          });

        // Allow the user to click a new dot
        nodes.on('click',function(d){

          selectedRace = d.race;
          selectedNode = d3.select(this);
          selectedNodeIncome = selectedNode.data()[0].income;
          selectedNodeEducation = selectedNode.data()[0].education;
          selectedNodeSqNum = selectedNode.data()[0].statusQuoNeighbNum;
          selectedNodeSqSchool = selectedNode.data()[0].statusQuoSchool;
          selectedNodeEducation = selectedNode.data()[0].education;

          d3.selectAll('.circle')
            .style('fill',function(d){ return scaleColor(d.race); })
            .style('opacity',0.3).attr('r',2);

          selectedNode.select('.circle').attr('r',5);

          // Income sidebar text
          d3.select('.profile-income').html(d3.format('$,')(selectedNodeIncome));

        });

      });

    // Race text
    var raceTxtA = textFull.append('div').attr('class','txt race-txt').style('margin-top',h/10+'px').style('display','none');
    raceTxtA.append('p').attr('class','body').text("Chicago's demographics");
    raceTxtA.append('p').attr('class','body').style('margin-top',h*0.1+'px').style('margin-bottom',h*0.025+'px')
      .text('Of the city\'s K-8 school-age children:');
    var raceTxtB = textThird1.append('div').style('display','none');
    raceTxtB.append('p').attr('class','body').text('17% are White');
    var raceTxtC = textThird2.append('div').style('display','none');
    raceTxtC.append('p').attr('class','body').text('35% are Black');
    var raceTxtD = textThird3.append('div').style('display','none');
    raceTxtD.append('p').attr('class','body').text('43% are Hispanic');

    // Income button
    var incomeBtn = d3.select('#continue-income');
    incomeBtn.on('click',function(){
        d3.select(this).transition().style('display','none');
        raceTxtA.style('display','none');
        raceTxtB.style('display','none');
        raceTxtC.style('display','none');
        raceTxtD.style('display','none');
        incomeTxt.style('display','block');
        educationBtn.style('display','block');
        learnMoreRace.style('display','none');


        // Add axis and median lines
        incomeGraph = mainSvg.append('g');
        incomeGraph.append('g').attr('class','income-axis').attr('transform','translate('+ 0 +','+ (h*0.68) +')').call(income_X_Axis);
        incomeGraph.append('line').attr('class','white-median')
          .attr('x1',incomeScaleX(75416)).attr('x2',incomeScaleX(75416)).attr('y1',(h*0.30)).attr('y2',(h*0.65))
          .style('stroke','blue').style('stroke-width',1).style('opacity',0.5);
        incomeGraph.append('line').attr('class','hispanic-median')
          .attr('x1',incomeScaleX(43530)).attr('x2',incomeScaleX(43530)).attr('y1',(h*0.30)).attr('y2',(h*0.65))
          .style('stroke','green').style('stroke-width',1).style('opacity',0.5);
        incomeGraph.append('line').attr('class','hispanic-median')
          .attr('x1',incomeScaleX(30193)).attr('x2',incomeScaleX(30193)).attr('y1',(h*0.30)).attr('y2',(h*0.65))
          .style('stroke','purple').style('stroke-width',1).style('opacity',0.5);

        // Income sidebar text
        d3.select('.profile-income').html(d3.format('$,')(selectedNodeIncome));
        d3.select('.node-income').html('Your household income is '+d3.format('$,')(selectedNodeIncome)+'.');
        d3.select('#change-income').style('visibility','visible');

        simulation
          .force('x-race',null)
          .force('y-race',null)
          .force('x-income',incomeXForce)
          .force('y-income',incomeYForce);

        simulation.alpha(1).restart()
          .on('end',function(){
            console.log('end');
          });

      });

    // Income text
    var incomeTxt = textFull.append('div').attr('class','txt income-txt').style('margin-top',h/10+'px').style('display','none');
    incomeTxt.append('p').attr('class','body').text('What is your household income?');
    incomeTxt.append('p').attr('class','body node-income');
    incomeTxt.append('p').attr('class','body').text('The median household income in Chicago is $46,255. For white households it is $75,416. For Hispanic households, it is $43,530. For black households, it is $30,193.');

    // Education button
    var educationBtn = d3.select('#continue-education');
    educationBtn.on('click',function(){

        d3.selectAll('.circle').transition().style('opacity',function(d){ return readinessScale(d.readiness); });

        d3.select(this).transition().style('display','none');
        incomeTxt.style('display','none');
        neighborhoodBtnA.style('display','block');
        educationTxt.style('display','block');

        // Education sidebar text
        d3.select('.profile-readiness').html(nodeReadiness);
        d3.select('#change-education').style('visibility','visible');

        d3.select('.node-education').html('Your child is '+nodeReadiness+' for school.');

        simulation
          .force('y-income',null)
          .force('y-readiness',readinessYForce);

        simulation.alpha(1).restart()
          .on('end',function(){
            console.log('end');
          });

      });

    // Education text
    var educationTxt = textFull.append('div').attr('class','txt education-txt').style('margin-top',h/10+'px').style('display','none');
    educationTxt.append('p').attr('class','body').text('Is your child ready for school?');
    educationTxt.append('p').attr('class','body node-education');
    educationTxt.append('p').attr('class','body').text('School readiness is an important factor in academic success in grade school, leading to a higher liklihood of completing high school, but fewer than half of poor children are school ready at age five. There is a 27 point gap in school readiness between poor children and those from moderate or higher income families.');

    // Neighborhood buttons
    var neighborhoodBtnA = d3.select('#continue-neighborhood-A');
    neighborhoodBtnA.on('click',function(){

        d3.select(this).transition().style('display','none');
        educationTxt.style('display','none');
        d3.select('.income-axis').transition().style('display','none');
        nodes.transition().style('visibility','hidden');
        incomeGraph.style('visibility','hidden');
        neighborhoodTxt.style('display','block');
        resPolicyButtons.style('display','block');
        learnMoreRes.style('display','block');

        createSQNeighborhoodBtns();

        var zones = mainSvg.selectAll('.zone')
          .data(map.features)
          .enter().append('path')
          .attr('class',function(d){ return 'zone zone'+d.properties.value; })
          .attr('d',projectionPath)
          .style('fill','gray').style('stroke','white').style('stroke-weight',0.25);

      });

    // Update the buttons and simulation on policy toggle
    d3.select('#LI-residential').on('click',function(d){
      d3.selectAll('.nbhd-group').remove();
      createLINeighborhoodBtns();
      simulation.alpha(1).restart()
        .on('end',function(){
          console.log('end');
        });
    });

    d3.select('#SQ-residential').on('click',function(d){
      d3.selectAll('.nbhd-group').remove();
      createSQNeighborhoodBtns();
      simulation.alpha(1).restart()
        .on('end',function(){
          console.log('end');
        });
    })

    // Neighborhood text
    var neighborhoodTxt = textFull.append('div').attr('class','txt neighborhood-txt').style('margin-top',h/10+'px').style('display','none');
    neighborhoodTxt.append('p').attr('class','body').text('Neighborhood');
    neighborhoodTxt.append('p').attr('class','body').text('Based on your income, you can afford to live in the highlighted neighborhood types. Hover to see descriptions and what areas these neighborhood types represent. For more options, click on "Low Income" to advocate for more low-income housing in higher value neighborhoods.');
    neighborhoodTxt.append('p').attr('class','prompt').text('Choose a neighborhood to live in.');

    var neighborhoodTxtB = textFull.append('div').attr('class','txt neighborhood-txt').style('margin-top',h/10+'px').style('display','none');
    neighborhoodTxtB.append('p').attr('class','body neighborhood-text-b');

    var createSQNeighborhoodBtns = function(){

      // Draw the neighborhood buttons
      var nbhds = mainSvg.selectAll('.nbhd-group').data(neighborhoods[0].values)
        .enter().append('g').attr('class','nbhd-group')
        .attr('transform',function(d){ return 'translate('+ nbhdScaleX(d.alias) +','+ nbhdScaleY(d.alias) +')' })
        .on('click',function(d){ if(selectedNodeSqNum >= d.sqNum){

          // *** If the choice is less than the status quo neighborhood, then trigger the diverse choice dataset and update a new variable for the selected dot.
          neighborhoodSegregation = 'W/B: 72.6' + '<br/>' + 'W/H: 46.1';
          selectedNode.data()[0].statusQuoNeighbNum = d.sqNum;
          selectedNodeSqNum = selectedNode.data()[0].statusQuoNeighbNum;
          neighborhoodBtnB.style('display','block');
          neighborhoodTxt.style('display','none')

          // Neighborhood sidebar text
          d3.select('.profile-neighborhood').html(selectedNodeSqNum);
          d3.select('.profile-residential-segregation').html(neighborhoodSegregation);
          d3.select('#change-neighborhood').style('visibility','visible');

          nodes.transition().style('visibility','visible');

          simulation
            .force('x-school',null)
            .force('y-school',null)
            .force('collide',null)
            .force('x-race',null)
            .force('y-race',null)
            .force('x-income',null)
            .force('y-income',null)
            .force('y-readiness',null)
            .force('one',isolate(d3.forceRadial(50, col1, row1), function(d){ return d.statusQuoNeighbNum === '1'; }))
            .force('two',isolate(d3.forceRadial(50, col2, row1), function(d){ return d.statusQuoNeighbNum === '2'; }))
            .force('three',isolate(d3.forceRadial(50, col3, row1), function(d){ return d.statusQuoNeighbNum === '3'; }))
            .force('four',isolate(d3.forceRadial(50, col1, row2), function(d){ return d.statusQuoNeighbNum === '4'; }))
            .force('five',isolate(d3.forceRadial(50, col2, row2), function(d){ return d.statusQuoNeighbNum === '5'; }))
            .force('six',isolate(d3.forceRadial(50, col3, row2), function(d){ return d.statusQuoNeighbNum === '6'; }))
            .force('seven',isolate(d3.forceRadial(50, col1, row3), function(d){ return d.statusQuoNeighbNum === '7'; }))
            .force('eight',isolate(d3.forceRadial(50, col2, row3), function(d){ return d.statusQuoNeighbNum === '8'; }))
            .force('nine',isolate(d3.forceRadial(50, col3, row3), function(d){ return d.statusQuoNeighbNum === '9'; }))
            .force('charge',chargeForce);

          simulation.alpha(1).restart()
            .on('end',function(){
              console.log('end');
            });
        }})
        .on('mouseenter',function(d){
            var description = d3.selectAll('.'+d.alias+'-description');
            description.transition().style('opacity',1);
            var highlight = d3.selectAll('.zone'+d.neighborhood);
            highlight.transition().style('fill','red');
            if(selectedNodeSqNum >= d.sqNum) {
              d3.select(this).style('cursor','pointer')
            }
        })
        .on('mouseleave',function(d){
            var description = d3.selectAll('.'+d.alias+'-description');
            description.transition().style('opacity',0);
            var highlight = d3.selectAll('.zone'+d.neighborhood);
            highlight.transition().style('fill','gray');
        });

      nbhds.append('circle').attr('class','nbhd').style('r',20).style('fill','#cccccc')
        .style('opacity',function(d){ if(selectedNodeSqNum >= d.sqNum){ return 1; } else { return 0.2; } });
      nbhds.append('text').text(function(d){ return d.alias; }).attr('class','label')
        .attr('x',0).attr('dy','.35em').attr('text-anchor','middle').style('fill','#ffffff');
      nbhds.append('text').text(function(d){ return d.sqNeighbDescrA; }).attr('class',function(d){ return d.alias +'-description label'; })
        .attr('x',-10).attr('y','4em').style('text-anchor','middle').style('opacity',0);
      nbhds.append('text').text(function(d){ return d.sqNeighbDescrB; }).attr('class',function(d){ return d.alias +'-description label'; })
        .attr('x',-10).attr('y','5em').style('text-anchor','middle').style('opacity',0);
      nbhds.append('text').text(function(d){ return d.sqNeighbDescrC; }).attr('class',function(d){ return d.alias +'-description label'; })
        .attr('x',-10).attr('y','6em').style('text-anchor','middle').style('opacity',0);
      nbhds.append('text').text(function(d){ return d.sqNeighbDescrD; }).attr('class',function(d){ return d.alias +'-description label'; })
        .attr('x',-10).attr('y','7em').style('text-anchor','middle').style('opacity',0);
    }


    var createLINeighborhoodBtns = function(){

      // Draw the neighborhood buttons
      var nbhds = mainSvg.selectAll('.nbhd-group').data(neighborhoods[0].values)
        .enter().append('g').attr('class','nbhd-group')
        .attr('transform',function(d){ return 'translate('+ nbhdScaleX(d.alias) +','+ nbhdScaleY(d.alias) +')' })
        .on('click',function(d){ if(selectedNodeLiNum >= d.sqNum || (d.sqNum == 7 || d.sqNum == 8 & selectedNodeIncome <= 50000)){

          // *** If the choice is less than the status quo neighborhood, then trigger the diverse choice dataset and update a new variable for the selected dot.
          neighborhoodSegregation = 'W/B: 58.7' + '<br/>' + 'W/H: 39.1';
          selectedNode.data()[0].LIHNeighbNum = d.sqNum;
          selectedNodeLiNum = selectedNode.data()[0].LIHNeighbNum;
          neighborhoodBtnB.style('display','block');
          neighborhoodTxt.style('display','none')

          // Neighborhood sidebar text
          d3.select('.profile-neighborhood').html(selectedNodeSqNum);
          d3.select('.profile-residential-segregation').html(neighborhoodSegregation);
          d3.select('#change-neighborhood').style('visibility','visible');

          nodes.transition().style('visibility','visible');

          simulation
          .force('x-school',null)
          .force('y-school',null)
          .force('collide',null)
          .force('x-race',null)
          .force('y-race',null)
          .force('x-income',null)
          .force('y-income',null)
          .force('y-readiness',null)
          .force('one',isolate(d3.forceRadial(50, col1, row1), function(d){ return d.LIHNeighbNum === '1'; }))
          .force('two',isolate(d3.forceRadial(50, col2, row1), function(d){ return d.LIHNeighbNum === '2'; }))
          .force('three',isolate(d3.forceRadial(50, col3, row1), function(d){ return d.LIHNeighbNum === '3'; }))
          .force('four',isolate(d3.forceRadial(50, col1, row2), function(d){ return d.LIHNeighbNum === '4'; }))
          .force('five',isolate(d3.forceRadial(50, col2, row2), function(d){ return d.LIHNeighbNum === '5'; }))
          .force('six',isolate(d3.forceRadial(50, col3, row2), function(d){ return d.LIHNeighbNum === '6'; }))
          .force('seven',isolate(d3.forceRadial(50, col1, row3), function(d){ return d.LIHNeighbNum === '7'; }))
          .force('eight',isolate(d3.forceRadial(50, col2, row3), function(d){ return d.LIHNeighbNum === '8'; }))
          .force('nine',isolate(d3.forceRadial(50, col3, row3), function(d){ return d.LIHNeighbNum === '9'; }))
          .force('charge',chargeForce);

          simulation.alpha(1).restart()
            .on('end',function(){
              console.log('end');
            });

        }})
        .on('mouseenter',function(d){
            var description = d3.selectAll('.'+d.alias+'-description');
            description.transition().style('opacity',1);
            var highlight = d3.selectAll('.zone'+d.neighborhood);
            highlight.transition().style('fill','red');
            if(selectedNodeSqNum >= d.sqNum) {
              d3.select(this).style('cursor','pointer')
            }
        })
        .on('mouseleave',function(d){
            var description = d3.selectAll('.'+d.alias+'-description');
            description.transition().style('opacity',0);
            var highlight = d3.selectAll('.zone'+d.neighborhood);
            highlight.transition().style('fill','gray');
        });

      nbhds.append('circle').attr('class','nbhd').style('r',20).style('fill','#cccccc')
        .style('opacity',function(d){ if(selectedNodeLiNum >= d.sqNum || (d.sqNum == 7 || d.sqNum == 8 & selectedNodeIncome <= 50000)){ return 1; } else { return 0.2; } });
      nbhds.append('text').text(function(d){ return d.alias; }).attr('class','label')
        .attr('x',0).attr('dy','.35em').attr('text-anchor','middle').style('fill','#ffffff');
      nbhds.append('text').text(function(d){ return d.sqNeighbDescrA; }).attr('class',function(d){ return d.alias +'-description label'; })
        .attr('x',-10).attr('y','4em').style('text-anchor','middle').style('opacity',0);
      nbhds.append('text').text(function(d){ return d.sqNeighbDescrB; }).attr('class',function(d){ return d.alias +'-description label'; })
        .attr('x',-10).attr('y','5em').style('text-anchor','middle').style('opacity',0);
      nbhds.append('text').text(function(d){ return d.sqNeighbDescrC; }).attr('class',function(d){ return d.alias +'-description label'; })
        .attr('x',-10).attr('y','6em').style('text-anchor','middle').style('opacity',0);
      nbhds.append('text').text(function(d){ return d.sqNeighbDescrD; }).attr('class',function(d){ return d.alias +'-description label'; })
        .attr('x',-10).attr('y','7em').style('text-anchor','middle').style('opacity',0);
    }

    // Neighborhood buttons
    var neighborhoodBtnB = d3.select('#continue-neighborhood-B');
    neighborhoodBtnB.on('click',function(){
      d3.selectAll('.nbhd-group').remove();
      resPolicyButtons.style('display','none');
      schoolPolicyButtons.style('display','block');
      neighborhoodTxt.style('display','none');
      schoolTxt.style('display','block');
      learnMoreSchool.style('display','block');
      createSchoolBtns();
      });


    // School text
    var schoolTxt = textFull.append('div').attr('class','txt school-txt').style('margin-top',h/10+'px').style('display','none');
    schoolTxt.append('p').attr('class','body').text('Elementary school');
    schoolTxt.append('p').attr('class','body').text('Each neighborhood has an assigned neighborhood public school. You can choose to remain in your public school or, if you have the income and your child can pass the entrance exam, you can choose a charter/selective school or private school.');
    schoolTxt.append('p').attr('class','prompt').text('Choose an elementary school for your child.');

    var createSchoolBtns = function(){
      // Draw the school buttons
      schls = mainSvg.selectAll('.school-group').data(schools)
        .enter().append('g').attr('class','school-group')
        .attr('transform',function(d){ return 'translate('+ schoolScaleX(d.actual) +','+ schoolScaleY(d.actual) +')'})
        .on('click',function(d){
          // draw();
          console.log(d.actual);
          console.log(selectedNodeSqSchool);
          console.log(selectedNode.data()[0].statusQuoSchool);
          selectedNode.data()[0].statusQuoSchool = d.actual;
          selectedNodeSqSchool = selectedNode.data()[0].statusQuoSchool;
          console.log(selectedNodeSqNum);
          // schoolPolicyButtons.style('display','none');
          d3.selectAll('.nbhd-group').remove();


          // Neighborhood sidebar text
          d3.select('.profile-school').html(selectedNodeSqSchool);
          d3.select('#change-school').style('visibility','visible');

          // neighborhoodTxt.style('display','none');
          // schoolTxt.style('display','block');
          simulation
          .force('x-school',null)
          .force('y-school',null)
          .force('collide',null)
          .force('x-race',null)
          .force('y-race',null)
          .force('x-income',null)
          .force('y-income',null)
          .force('y-readiness',null)
          .force('one',isolate(d3.forceRadial(50, col1, row1), function(d){ return d.statusQuoSchool === 'SchAB'; }))
          .force('two',isolate(d3.forceRadial(50, col2, row1), function(d){ return d.statusQuoSchool === 'SchA'; }))
          .force('three',isolate(d3.forceRadial(50, col3, row1), function(d){ return d.statusQuoSchool === 'SchBH'; }))
          .force('four',isolate(d3.forceRadial(50, col1, row2), function(d){ return d.statusQuoSchool === 'SchBB'; }))
          .force('five',isolate(d3.forceRadial(50, col2, row2), function(d){ return d.statusQuoSchool === 'SchB'; }))
          .force('six',isolate(d3.forceRadial(50, col3, row2), function(d){ return d.statusQuoSchool === 'SchC'; }))
          .force('seven',isolate(d3.forceRadial(50, col1, row3), function(d){ return d.statusQuoSchool === 'SchCW'; }))
          .force('eight',isolate(d3.forceRadial(50, col2, row3), function(d){ return d.statusQuoSchool === 'SchD'; }))
          .force('nine',isolate(d3.forceRadial(50, col3, row3), function(d){ return d.statusQuoSchool === 'SchDW'; }))
          .force('charter',isolate(d3.forceRadial(50, col4, row2), function(d){ return d.statusQuoSchool === 'Charter'; }))
          .force('private',isolate(d3.forceRadial(50, col4, row3), function(d){ return d.statusQuoSchool === 'Private'; }))
          .force('charge',chargeForce);

          simulation.alpha(1).restart()
            .on('end',function(){ console.log('end'); });
          })
          .on('mouseenter',function(d){ if(selectedNodeSqSchool == d.actual || selectedNodeIncome >= 60000 || d.actual == 'Charter'){
              // var description = d3.select('#'+d.alias+'-description');
              // description.transition().style('opacity',1);
              // console.log(d.sqNum);
          }})
          .on('mouseleave',function(d){ if(selectedNodeSqSchool == d.actual || selectedNodeIncome >= 60000 || d.actual == 'Charter'){
              // var description = d3.select('#'+d.alias+'-description');
              // description.transition().style('opacity',0);
          }});

        schls.append('rect').attr('class','school button-rect').style('width',70).style('height',35)
          .style('fill','#cccccc').style('border-radius','25px').style('text-align','center')
          .style('opacity',function(d){
            if(selectedNodeSqNum == d.sqNum){ return 1; }
              else if (selectedNodeIncome >= 60000){ return 1; }
                else if (d.actual == 'Charter'){ return 1; }
                  else{ return 0.2; }
            });
        schls.append('text').text(function(d){ return d.schType; }).attr('class','label')
          .attr('x',35).attr('y',17).attr('text-anchor','middle').style('fill','#ffffff').style('alignment-baseline','middle');
        // schools.append('text').text(function(d){ return d.sqNeighbDescr; }).attr('class','body').attr('id',function(d){ return d.alias +'-description'; })
        //   .attr('x',-10).attr('y',50).style('text-anchor','middle').style('opacity',0);

    }

    // Refresh button
    var refreshBtn = d3.select('#refresh-btn');
    refreshBtn.on('click',function(){
      location.reload(true);
    });

    // Change race button
    d3.select('#change-race').on('click',function(){
      console.log('change race');

      // Things to remove
      incomeTxt.style('display','none');
      educationBtn.style('display','none');
      neighborhoodBtn.style('display','none');
      neighborhoodTxt.style('display','none');
      educationTxt.style('display','none');
      d3.select('.income-axis').remove();
      schoolTxt.style('display','none');
      d3.selectAll('.school-group').remove();
      d3.selectAll('.nbhd-group').remove();
      context.clearRect(0, 0, w, h); // Clear the canvas.

      // Things to show
      incomeBtn.style('display','block');
      raceTxtA.style('display','block');
      raceTxtB.style('display','block');
      raceTxtC.style('display','block');
      raceTxtD.style('display','block');
      nodes.transition().style('visibility','visible');


      simulation
        // Need to null all of the other possible forces
        .force('x-race',null)
        .force('y-race',null)
        .force('charge',null)
        .force('x-income',null)
        .force('y-income',null)
        // .force('collide-null',null)
        .force('x-neighborhood',null)
        .force('y-neighborhood',null)
        .force('x-school',null)
        .force('y-school',null)
        .force('collide',collideForce)
        .force('x-race',raceXForce)
        .force('y-race',raceYForce);
      simulation.alpha(1).restart()
        .on('end',function(){
          console.log('end');
        });
    });

    // Change income button
    d3.select('#change-income').on('click',function(){
      console.log('change income');

      // Things to remove
      incomeBtn.style('display','none');
      raceTxtA.style('display','none');
      raceTxtB.style('display','none');
      raceTxtC.style('display','none');
      raceTxtD.style('display','none');
      neighborhoodBtn.style('display','none');
      neighborhoodTxt.style('display','none');
      educationTxt.style('display','none');
      d3.select('.income-axis').remove();
      schoolTxt.style('display','none');
      d3.selectAll('.school-group').remove();
      d3.selectAll('.nbhd-group').remove();
      context.clearRect(0, 0, w, h); // Clear the canvas.

      // Things to show
      incomeTxt.style('display','block');
      educationBtn.style('display','block');
      nodes.transition().style('visibility','visible');
      // Add axis
      mainSvg.append('g').attr('class','income-axis').attr('transform','translate('+ 0 +','+ ((h/2)+150) +')').call(income_X_Axis);


      simulation
        // Need to null all of the other possible forces
        .force('x-race',null)
        .force('y-race',null)
        .force('charge',null)
        .force('x-income',incomeXForce)
        .force('y-income',incomeYForce)
        // .force('collide-null',null)
        .force('x-neighborhood',null)
        .force('y-neighborhood',null)
        .force('x-school',null)
        .force('y-school',null)
        .force('collide',collideForce)
        .force('x-race',null)
        .force('y-race',null);
      simulation.alpha(1).restart()
        .on('end',function(){
          console.log('end');
        });
    });

    // Change education button
    d3.select('#change-income').on('click',function(){
      console.log('change education');
    });

    // Change neighborhood
    d3.select('#change-neighborhood').on('click',function(){
      console.log('change neighborhood');
      schoolTxt.style('display','none');
      nodes.transition().style('visibility','hidden');
      // schls.transition().style('visibility','hidden');
      d3.selectAll('.school-group').remove();
      d3.selectAll('.nbhd-group').remove();
      neighborhoodTxt.style('display','block');
      context.clearRect(0, 0, w, h); // Clear the canvas.
      createNeighborhoodBtns();
    });

    // Change school
    d3.select('#change-school').on('click',function(){
      console.log('change school');
      neighborhoodTxt.style('display','none');
      schoolTxt.style('display','block');
      d3.selectAll('.school-group').remove();
      createSchoolBtns();
      context.clearRect(0, 0, w, h); // Clear the canvas
      simulation
        .force('charge',null)
        // .force('collide-null',collideForceLarge)
        .force('x-neighborhood',null)
        .force('y-neighborhood',null)
        .force('x-school',null)
        .force('y-school',null)
        .force('collide',collideForce)
        .force('x-race',null)
        .force('y-race',null)
        .force('x-income',null)
        .force('y-income',null)
        .force('x-neighborhood',neighborhoodXForce)
        .force('y-neighborhood',neighborhoodYForce);
      simulation.alpha(1).restart()
        .on('end',function(){ console.log('end'); });

    });

  }

  return exports;

}
