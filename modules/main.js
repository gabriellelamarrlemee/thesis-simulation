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
      schoolSegregation,
      degrees = 180/Math.PI,
      selectedRace,
      selectedNode,
      selectedNodeEducation,
      selectedNodeIncome,
      selectedNodeSqNum,
      selectedNodeLiNum,
      selectedNodeSqSchool,
      selectedNodeSch,
      selectionTxt,
      schls,
      incomeGraph,
      nodeReadiness;

  var dispatcher = d3.dispatch('update');
  var profile = Profile();
  var results = Results();
  var tooltip = d3.select('.custom-tooltip');

  // Scales
  var scaleColor = d3.scaleOrdinal().domain(['White','Black','Hispanic']).range(['#00ccff','#cc00ff','#66ff33']);
  var raceScaleX = d3.scaleOrdinal().domain(['White','Black','Hispanic']);
  var incomeScaleX = d3.scaleLinear().domain([0,200000]);
  var readinessScale = d3.scaleOrdinal().domain([1,2]).range([1,0.4]);
  var readinessScaleY = d3.scaleOrdinal().domain([1,2]).range([incomeY-50,incomeY+70]);
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

    // var sidebarSvg = d3.select('#sidebar').append('svg').attr('position','fixed');
    var mainSvg = selection.append('svg').attr('width',w).attr('height',h);

    var canvas = selection.append('canvas')
      .attr('class','canvas')
      .attr('width',w)
      .attr('height',h);

    var context = canvas.node().getContext('2d');
    context.clearRect(0, 0, w, h); // Clear the canvas.

    // Neighborhood placement
    var col1 = (w*0.2),
        col2 = (w*0.35),
        col3 = (w*0.5),
        col4 = (w*0.65),
        row1 = (h*0.3),
        row2 = (h*0.47),
        row3 = (h*0.64);
    // Second neighborhood placement
    var col1B = ((w/10)),
        col2B = ((w/10)*2),
        col3B = ((w/10)*3),
        col4B = ((w/10)*4),
        col5B = ((w/10)*5),
        col6B = ((w/10)*6),
        col7B = ((w/10)*7),
        col8B = ((w/10)*8),
        col9B = ((w/10)*9),
        row1B = (h*0.3),
        row2B = (h*0.5),
        row3B = (h*0.7);

    var nbhdScaleX = d3.scaleOrdinal()
      .domain(['1','2','3','4','5','6','7','8','9'])
      .range([col1,col2,col3,col1,col2,col3,col1,col2,col3]);
    var nbhdScaleX_B = d3.scaleOrdinal()
      .domain(['1','2','3','4','5','6','7','8','9'])
      .range([col1B,col2B,col3B,col4B,col5B,col6B,col7B,col8B,col9B]);
    var nbhdScaleY = d3.scaleOrdinal()
      .domain(['1','2','3','4','5','6','7','8','9'])
      .range([row1,row1,row1,row2,row2,row2,row3,row3,row3]);
    var schoolScaleX = d3.scaleOrdinal().domain(['SchAB','SchA','SchBH','SchBB','SchB','SchC','SchCW','SchD','SchDW','Charter','Private'])
      .range([col1B,col2B,col3B,col4B,col5B,col6B,col7B,col8B,col9B,col4B,col6B]);
    var schoolScaleY = d3.scaleOrdinal().domain(['SchAB','SchA','SchBH','SchBB','SchB','SchC','SchCW','SchD','SchDW','Charter','Private'])
      .range([row2B,row2B,row2B,row2B,row2B,row2B,row2B,row2B,row2B,row3B,row3B]);

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
          .style('opacity',.4).attr('r',2);
        d3.selectAll('.outer')
          .attr('r',7);

        // Selection text
        introTxtB.style('display','block');
        introTxtB.append('p').attr('class','your').text('Your child is ' + selectedRace).style('display','block');

        selectedNode.select('.circle').style('opacity',1).attr('r',8);
        selectedNode.style('stroke','#000000').style('stroke-width','10px');
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
      .attr('opacity',1);

    nodes.append('path')
      .datum(function(d) { return d.path.slice(0, 3); })
      .attr("class", "mid");

    nodes.on('mouseenter',function(d){


    });



    // Draw the canvas circle
    function draw() {
      d3.selectAll('.circle').each(function(d,i){
        var contextNode = d3.select(this);
        context.fillStyle = contextNode.style('fill');
        context.globalAlpha = contextNode.style('opacity');
        context.globalAlpha = 0.3;
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
    });

    learnMoreRes.on('click',function(){
      d3.select('#detail-res').style('visibility','visible');
    });

    learnMoreSchool.on('click',function(){
      d3.select('#detail-school').style('visibility','visible');
    });


    // Intro text
    var introTxtA = textFull.append('div').attr('class','txt introA-txt').style('margin-top',h*0.33+'px');
    introTxtA.append('p').attr('class','title').text('EDUCATE YOUR CHILD');
    introTxtA.append('p').attr('class','body').text('The Chicago public school system, third largest in the country has a high level of school segregation. You are a parent of a 5 year old child in the city and now you have to make some school decisions. Explore how parent choices and policy changes can affect the educational experience of students?');
    introTxtA.append('p').attr('class','prompt').text('Select a dot to begin');
    var introTxtB = textFull.append('div').attr('class','txt introB-txt').style('margin-top',h*0.45+'px').style('display','none');

    // Race button
    var raceBtn = d3.select('#continue-race');
    raceBtn.on('click',function(){
        // Change the width of the main area
        mainSvg.attr('width',w).attr('height',h);
        textDiv.style('width',w+'px');
        d3.selectAll('.circle').style('opacity',1);

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

        d3.select('#sidebar').style('visibility','visible');
        d3.selectAll('.sidebar-section').style('background-color','transparent');
        d3.select('#race').style('background-color','#202020');

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
    var raceTxtA = textFull.append('div').attr('class','txt race-txt').style('margin-top',h*0.05+'px').style('display','none');
    raceTxtA.append('p').attr('class','page-title').text("CHICAGO'S DEMOGRAPHICS");
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
          .style('stroke','#00ccff').style('stroke-width',1).style('opacity',1).style('stroke-dasharray','5,5');
        incomeGraph.append('line').attr('class','hispanic-median')
          .attr('x1',incomeScaleX(43530)).attr('x2',incomeScaleX(43530)).attr('y1',(h*0.30)).attr('y2',(h*0.65))
          .style('stroke','#66ff33').style('stroke-width',1).style('opacity',1).style('stroke-dasharray','5,5');
        incomeGraph.append('line').attr('class','black-median')
          .attr('x1',incomeScaleX(30193)).attr('x2',incomeScaleX(30193)).attr('y1',(h*0.30)).attr('y2',(h*0.65))
          .style('stroke','#cc00ff').style('stroke-width',1).style('opacity',1).style('stroke-dasharray','5,5');

        // Race labels
        incomeGraph.append('text').attr('class','axis-text')
          .attr('x',(w/5)-30).attr('y',incomeScaleY('White'))
          .style('fill','#00ccff').text('White Households');
        incomeGraph.append('text').attr('class','axis-text')
          .attr('x',(w/5)-30).attr('y',incomeScaleY('Black'))
          .style('fill','#cc00ff').text('Black Households');
        incomeGraph.append('text').attr('class','axis-text')
          .attr('x',(w/5)-30).attr('y',incomeScaleY('Hispanic'))
          .style('fill','#66ff33').text('Hispanic Households');

        // Income sidebar text
        d3.select('.profile-income').html(d3.format('$,')(selectedNodeIncome));
        d3.select('.node-income').html('Your household income is '+d3.format('$,')(selectedNodeIncome)+'.');
        d3.selectAll('.sidebar-section').style('background-color','transparent');
        d3.select('#income').style('background-color','#202020');
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
    var incomeTxt = textFull.append('div').attr('class','txt income-txt').style('margin-top',h*0.05+'px').style('display','none');
    incomeTxt.append('p').attr('class','page-title').text('WHAT IS YOUR HOUSEHOLD INCOME?');
    incomeTxt.append('p').attr('class','your node-income');
    incomeTxt.append('p').attr('class','body').text('The median household income in Chicago is $46,255. For white households it is $75,416. For Hispanic households, it is $43,530. For black households, it is $30,193.');

    // Education button
    var educationBtn = d3.select('#continue-education');
    educationBtn.on('click',function(){

        d3.selectAll('.circle').transition().style('opacity',function(d){ return readinessScale(d.readiness); });

        d3.select(this).transition().style('display','none');
        incomeTxt.style('display','none');
        neighborhoodBtnA.style('display','block');
        educationTxt.style('display','block');

        d3.selectAll('.axis-text').remove();
        // Race labels
        incomeGraph.append('text').attr('class','axis-text')
          .attr('x',(w/5)-30).attr('y',incomeY-25)
          .style('fill','#E8E8E8').text('Ready for School');
        incomeGraph.append('text').attr('class','axis-text')
          .attr('x',(w/5)-30).attr('y',incomeY+85).style('opacity',0.4)
          .style('fill','#E8E8E8').text('Not Ready for School');

          // var incomeScaleY = d3.scaleOrdinal().domain(['White','Black','Hispanic']).range([incomeY-75,incomeY,incomeY+75]);


        // Education sidebar text
        d3.select('.profile-readiness').html(nodeReadiness);
        d3.selectAll('.sidebar-section').style('background-color','transparent');
        d3.select('#education').style('background-color','#202020');
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
    var educationTxt = textFull.append('div').attr('class','txt education-txt').style('margin-top',h*0.05+'px').style('display','none');
    educationTxt.append('p').attr('class','page-title').text('IS YOUR CHILD READY FOR SCHOOL?');
    educationTxt.append('p').attr('class','your node-education');
    educationTxt.append('p').attr('class','body').text('School readiness is an important factor in academic success in grade school, leading to a higher liklihood of completing high school, but fewer than half of poor children are school ready at age five. There is a 27 point gap in school readiness between poor children and those from moderate or higher income families.');

    // Neighborhood buttons
    var neighborhoodBtnA = d3.select('#continue-neighborhood-A');
    neighborhoodBtnA.on('click',function(){

        d3.select(this).transition().style('display','none');
        educationTxt.style('display','none');
        d3.select('.income-axis').transition().style('display','none');
        incomeGraph.style('visibility','hidden');
        neighborhoodTxt.style('display','block');
        resPolicyButtons.style('display','block');
        nodes.style('visibility','hidden');

        d3.selectAll('.sidebar-section').style('background-color','transparent');
        d3.select('#neighborhood').style('background-color','#202020');
        d3.select('#residential-segregation').style('background-color','#202020');

        // createSQNeighborhoodBtns();

        var zones = mainSvg.selectAll('.zone')
          .data(map.features)
          .enter().append('path')
          .attr('class',function(d){ return 'zone zone'+d.properties.value; })
          .attr('d',projectionPath)
          .style('fill','#202020').style('stroke','#E8E8E8')
          .style('stroke-weight',0.25).style('stroke-opacity',0.3);

      });

    // Update the buttons and simulation on policy toggle
    d3.select('#LI-residential').on('click',function(d){
      d3.selectAll('.nbhd-group').remove();
      resPolicyButtons.style('display','none');
      createLINeighborhoodBtns();
      learnMoreRes.style('display','block');
    });

    d3.select('#SQ-residential').on('click',function(d){
      d3.selectAll('.nbhd-group').remove();
      resPolicyButtons.style('display','none');
      createSQNeighborhoodBtns();
      learnMoreRes.style('display','block');
    });

    // Neighborhood text
    var neighborhoodTxt = textFull.append('div').attr('class','txt neighborhood-txt').style('margin-top',h*0.05+'px').style('display','none');
    neighborhoodTxt.append('p').attr('class','page-title').text('NEIGHBORHOOD');
    neighborhoodTxt.append('p').attr('class','body').text('Based on your income, you can afford to live in the highlighted neighborhood types. For more options, click on "Low Income" to advocate for more low-income housing in higher value neighborhoods.');
    neighborhoodTxt.append('p').attr('class','prompt').text('Choose a neighborhood to live in.');

    var neighborhoodTxtB = textFull.append('div').attr('class','txt neighborhood-txt').style('margin-top',h*0.05+'px').style('display','none');
    neighborhoodTxtB.append('p').attr('class','your neighborhood-text-b');

    var neighborhoodTxtC = d3.select('#right-col').append('div').attr('class','txt neighborhood-txt').style('margin-top',h*0.15+'px').style('display','none');
    neighborhoodTxtC.append('p').attr('class','body-left neighborhood-text-b').style('margin-bottom','20px');

    var chosenResPolicy;
    var selectedHouse;

    var createSQNeighborhoodBtns = function(){

      // Draw the neighborhood buttons
      var nbhds = mainSvg.selectAll('.nbhd-group').data(neighborhoods[0].values)
        .enter().append('g').attr('class','nbhd-group')
        .attr('transform',function(d){ return 'translate('+ nbhdScaleX(d.alias) +','+ nbhdScaleY(d.alias) +')' })
        .on('click',function(d){ if(selectedNodeSqNum >= d.sqNum){

          selectedHouse = d3.select(this);

          // *** If the choice is less than the status quo neighborhood, then trigger the diverse choice dataset and update a new variable for the selected dot.

          selectedNode.data()[0].statusQuoNeighbNum = d.sqNum;
          selectedNode.data()[0].DCNeighbNum = d.sqNum;
          selectedNodeSch = d.neighborhood;
          nodes.style('visibility','visible');
          neighborhoodBtnB.style('display','block');
          neighborhoodTxt.style('display','none');
          d3.selectAll('.zone').remove();

          console.log(selectedNodeSqNum);

          // Neighborhood sidebar text
          d3.select('.profile-neighborhood').html(selectedNodeSqNum);
          d3.select('#change-neighborhood').style('visibility','visible');

          if(d.sqNum <= selectedNodeSqNum-2 & selectedNodeIncome >= 100000){
            console.log('diverse choice');
            selectedNodeSqNum = d.sqNum;
            neighborhoodSegregation = 'W/B: 66.3' + '<br/>' + 'W/H: 38.4';
            d3.select('.profile-residential-segregation').html(neighborhoodSegregation);
            neighborhoodTxtB.style('display','block').select('p').html('You chose neighborhood '+selectedNodeSqNum+', <br/> a economically and racially diverse choice.');
            neighborhoodTxtC.style('display','block').select('p').html('If xx% of Chicagoans chose to live in a more economically and racially diverse neighborhood, the segregation level would decrease by xx%. <br/><br/> The current level is 72.6 between white and black residents and 46.1 between white and Hispanic residents. <br/><br/> With more mixed income neighborhoods, the level would be ' + neighborhoodSegregation + '. <br/><br/> Click the Learn More button to see the impacts of residential segregation.');

            chosenResPolicy = 'diverse';

            simulation
              .nodes(children)
              .force('x-school',null)
              .force('y-school',null)
              .force('collide',null)
              .force('x-race',null)
              .force('y-race',null)
              .force('x-income',null)
              .force('y-income',null)
              .force('y-readiness',null)
              .force('one',isolate(d3.forceRadial(45, col1, row1), function(d){ return d.DCNeighbNum === 1; }))
              .force('two',isolate(d3.forceRadial(45, col2, row1), function(d){ return d.DCNeighbNum === 2; }))
              .force('three',isolate(d3.forceRadial(45, col3, row1), function(d){ return d.DCNeighbNum === 3; }))
              .force('four',isolate(d3.forceRadial(45, col1, row2), function(d){ return d.DCNeighbNum === 4; }))
              .force('five',isolate(d3.forceRadial(45, col2, row2), function(d){ return d.DCNeighbNum === 5; }))
              .force('six',isolate(d3.forceRadial(45, col3, row2), function(d){ return d.DCNeighbNum === 6; }))
              .force('seven',isolate(d3.forceRadial(45, col1, row3), function(d){ return d.DCNeighbNum === 7; }))
              .force('eight',isolate(d3.forceRadial(45, col2, row3), function(d){ return d.DCNeighbNum === 8; }))
              .force('nine',isolate(d3.forceRadial(45, col3, row3), function(d){ return d.DCNeighbNum === 9; }))
              .force('charge',chargeForce);

              simulation.alpha(1).restart()
                .on('end',function(){ console.log('end'); });

          } else {
            console.log('not diverse choice');
            selectedNodeSqNum = d.sqNum;
            neighborhoodSegregation = 'W/B: 72.6' + '<br/>' + 'W/H: 46.1';
            d3.select('.profile-residential-segregation').html(neighborhoodSegregation);
            neighborhoodTxtB.style('display','block').select('p').html('You chose neighborhood '+selectedNodeSqNum+', <br/> a choice that maintains residential segregation.');
            neighborhoodTxtC.style('display','block').select('p').html('If xx% of Chicagoans chose to live in a more economically and racially diverse neighborhood, the segregation level would decrease by xx%. <br/><br/> The current level is 72.6 between white and black residents and 46.1 between white and Hispanic residents. <br/><br/> With more mixed income neighborhoods, the level would be ' + neighborhoodSegregation + '. <br/><br/> Click the Learn More button to see the impacts of residential segregation.');
            // neighborhoodTxtB.style('display','block').select('p').text('The dissimilarity index is commonly used to calculate segregation between two groups. The current level is ' + neighborhoodSegregation + '.');

            chosenResPolicy = 'status quo';
            selectedHouse = d3.select(this);


            simulation
              .nodes(children)
              .force('x-school',null)
              .force('y-school',null)
              .force('collide',null)
              .force('x-race',null)
              .force('y-race',null)
              .force('x-income',null)
              .force('y-income',null)
              .force('y-readiness',null)
              .force('one',isolate(d3.forceRadial(45, col1, row1), function(d){ return d.statusQuoNeighbNum === 1; }))
              .force('two',isolate(d3.forceRadial(45, col2, row1), function(d){ return d.statusQuoNeighbNum === 2; }))
              .force('three',isolate(d3.forceRadial(45, col3, row1), function(d){ return d.statusQuoNeighbNum === 3; }))
              .force('four',isolate(d3.forceRadial(45, col1, row2), function(d){ return d.statusQuoNeighbNum === 4; }))
              .force('five',isolate(d3.forceRadial(45, col2, row2), function(d){ return d.statusQuoNeighbNum === 5; }))
              .force('six',isolate(d3.forceRadial(45, col3, row2), function(d){ return d.statusQuoNeighbNum === 6; }))
              .force('seven',isolate(d3.forceRadial(45, col1, row3), function(d){ return d.statusQuoNeighbNum === 7; }))
              .force('eight',isolate(d3.forceRadial(45, col2, row3), function(d){ return d.statusQuoNeighbNum === 8; }))
              .force('nine',isolate(d3.forceRadial(45, col3, row3), function(d){ return d.statusQuoNeighbNum === 9; }))
              .force('charge',chargeForce);

              simulation.alpha(1).restart()
                .on('end',function(){ console.log('end'); });
          }

        }})
        .on('mouseenter',function(d){
            var tooltiptext = function(d){ if(selectedNodeSqNum >= d.sqNum){ return 'affordable'; } else { return 'not affordable'; } };
            var tooltiptexttwo = function(d){ return d.sqNeighbDescrA; };
            var tooltiptextthree = function(d){ return d.sqNeighbDescrB; };
            var tooltiptextfour = function(d){ return d.sqNeighbDescrC; };
            var tooltiptextfive = function(d){ return d.sqNeighbDescrD; };
            var highlight = d3.selectAll('.zone'+d.neighborhood);
            highlight.transition().style('fill','#e8e8e8');
            if(selectedNodeSqNum >= d.sqNum) { d3.select(this).style('cursor','pointer') };
            tooltip.transition().style('visibility','visible');
            tooltip.style('left',nbhdScaleX(d.alias)+40+'px').style('top',nbhdScaleY(d.alias)-40+'px');
            tooltip.select('.tooltip-title').html(tooltiptext(d));
            tooltip.select('.tooltip-two').html(tooltiptexttwo(d));
            tooltip.select('.tooltip-three').html(tooltiptextthree(d));
            tooltip.select('.tooltip-four').html(tooltiptextfour(d));
            tooltip.select('.tooltip-five').html(tooltiptextfive(d));
        })
        .on('mouseleave',function(d){
            var highlight = d3.selectAll('.zone'+d.neighborhood);
            highlight.transition().style('fill','#202020');
            tooltip.transition().style('visibility','hidden');
        });

      // nbhds.append('circle').attr('class','nbhd').style('r',20).style('fill','#e8e8e8')
      nbhds.append('svg:image').attr('xlink:href','./data/house_837518.svg').style('width',60).attr('x',-30).attr('y',-30)
        .style('opacity',function(d){ if(selectedNodeSqNum >= d.sqNum){ return 1; } else { return 0.2; } });
      // nbhds.append('text').text(function(d){ return d.alias; }).attr('class','graph-label')
      //   .attr('x',0).attr('dy','.25em').attr('text-anchor','middle').style('fill','#000000')
    }


    var createLINeighborhoodBtns = function(){

      // Draw the neighborhood buttons
      var nbhds = mainSvg.selectAll('.nbhd-group').data(neighborhoods[0].values)
        .enter().append('g').attr('class','nbhd-group')
        .attr('transform',function(d){ return 'translate('+ nbhdScaleX(d.alias) +','+ nbhdScaleY(d.alias) +')' })
        .on('click',function(d){ if(selectedNodeSqNum >= d.sqNum || ((d.sqNum == 7 || d.sqNum == 8) & selectedNodeIncome <= 50000)){

          // *** If the choice is less than the status quo neighborhood, then trigger the diverse choice dataset and update a new variable for the selected dot.
          neighborhoodSegregation = 'W/B: 58.7' + '<br/>' + 'W/H: 39.1';
          selectedNode.data()[0].LIHNeighbNum = d.sqNum;
          selectedNodeLiNum = selectedNode.data()[0].LIHNeighbNum;
          nodes.style('visibility','visible');
          neighborhoodBtnB.style('display','block');
          neighborhoodTxt.style('display','none');
          selectedNodeSch = d.neighborhood;
          d3.selectAll('.zone').remove();

          // Neighborhood sidebar text
          d3.select('.profile-neighborhood').html(selectedNodeSqNum);
          d3.select('.profile-residential-segregation').html(neighborhoodSegregation);
          d3.select('#change-neighborhood').style('visibility','visible');

          neighborhoodTxtB.style('display','block').select('p').html('You chose neighborhood '+selectedNodeSqNum+', <br/> and to advocate for more low-income housing.');
          neighborhoodTxtC.style('display','block').select('p').html('If xx% of low-income Chicagoans were able to move into higher value neighborhoods, residential segregation would be reduced by xx%. <br/><br/> The current level is 72.6 between white and black residents and 46.1 between white and Hispanic residents. <br/><br/> With more mixed income neighborhoods, the level would be ' + neighborhoodSegregation + '. <br/><br/> Click the Learn More button to see the impacts of residential segregation.');

          chosenResPolicy = 'low income';

          simulation
          .force('x-school',null)
          .force('y-school',null)
          .force('collide',null)
          .force('x-race',null)
          .force('y-race',null)
          .force('x-income',null)
          .force('y-income',null)
          .force('y-readiness',null)
          .force('one',isolate(d3.forceRadial(45, col1, row1), function(d){ return d.LIHNeighbNum === 1; }))
          .force('two',isolate(d3.forceRadial(45, col2, row1), function(d){ return d.LIHNeighbNum === 2; }))
          .force('three',isolate(d3.forceRadial(45, col3, row1), function(d){ return d.LIHNeighbNum === 3; }))
          .force('four',isolate(d3.forceRadial(45, col1, row2), function(d){ return d.LIHNeighbNum === 4; }))
          .force('five',isolate(d3.forceRadial(45, col2, row2), function(d){ return d.LIHNeighbNum === 5; }))
          .force('six',isolate(d3.forceRadial(45, col3, row2), function(d){ return d.LIHNeighbNum === 6; }))
          .force('seven',isolate(d3.forceRadial(45, col1, row3), function(d){ return d.LIHNeighbNum === 7; }))
          .force('eight',isolate(d3.forceRadial(45, col2, row3), function(d){ return d.LIHNeighbNum === 8; }))
          .force('nine',isolate(d3.forceRadial(45, col3, row3), function(d){ return d.LIHNeighbNum === 9; }))
          .force('charge',chargeForce);

          simulation.alpha(1).restart()
            .on('end',function(){
              console.log('end');
            });

        }})
        .on('mouseenter',function(d){
            var tooltiptext = function(d){ if(selectedNodeSqNum >= d.sqNum || ((d.sqNum == 7 || d.sqNum == 8) & selectedNodeIncome <= 50000)){ return 'affordable'; } else { return 'not affordable'; } };
            var tooltiptexttwo = function(d){ return d.sqNeighbDescrA; };
            var tooltiptextthree = function(d){ return d.sqNeighbDescrB; };
            var tooltiptextfour = function(d){ return d.sqNeighbDescrC; };
            var tooltiptextfive = function(d){ return d.sqNeighbDescrD; };
            var highlight = d3.selectAll('.zone'+d.neighborhood);
            highlight.transition().style('fill','#e8e8e8');
            if(selectedNodeLiNum >= d.sqNum || ((d.sqNum == 7 || d.sqNum == 8) & selectedNodeIncome <= 50000)) {
              d3.select(this).style('cursor','pointer')
            };
            tooltip.transition().style('visibility','visible');
            tooltip.style('left',nbhdScaleX(d.alias)-120+'px').style('top',nbhdScaleY(d.alias)+30+'px');
            tooltip.select('.tooltip-title').html(tooltiptext(d));
            tooltip.select('.tooltip-two').html(tooltiptexttwo(d));
            tooltip.select('.tooltip-three').html(tooltiptextthree(d));
            tooltip.select('.tooltip-four').html(tooltiptextfour(d));
            tooltip.select('.tooltip-five').html(tooltiptextfive(d));
        })
        .on('mouseleave',function(d){
          var highlight = d3.selectAll('.zone'+d.neighborhood);
          highlight.transition().style('fill','#202020');
          tooltip.transition().style('visibility','hidden');
        });

      nbhds.append('svg:image').attr('xlink:href','./data/house_837518.svg').style('width',60).attr('x',-30).attr('y',-30)
        .style('opacity',function(d){ if(selectedNodeSqNum >= d.sqNum || ((d.sqNum == 7 || d.sqNum == 8) & selectedNodeIncome <= 50000)){ return 1; } else { return 0.2; } });
    }

    // Neighborhood buttons
    var neighborhoodBtnB = d3.select('#continue-neighborhood-B');
    neighborhoodBtnB.on('click',function(){
      d3.selectAll('.nbhd-group').style('opacity',0.2);
      selectedHouse.style('opacity',0.6);
      resPolicyButtons.style('display','none');
      neighborhoodTxt.style('display','none');
      schoolTxt.style('display','block');
      // schoolTxtB.style('display','block');
      learnMoreSchool.style('display','inline-block');
      neighborhoodTxtB.style('display','none');
      neighborhoodTxtC.style('display','none');
      neighborhoodBtnB.style('display','none');
      learnMoreRes.style('display','none');

      createSQSchoolBtns();
      d3.selectAll('.sidebar-section').style('background-color','transparent');
      d3.select('#school').style('background-color','#202020');
      d3.select('#school-segregation').style('background-color','#202020');

      // Move the neighborhoods
      d3.selectAll('.nbhd-group').transition().attr('transform',function(d){ return 'translate('+ nbhdScaleX_B(d.alias) +','+ row1B +')' });
      d3.selectAll('.nbhd-group').on('mouseenter',null).on('click',null);

      // Move the dots
      if(chosenResPolicy == 'diverse'){
        simulation
          .nodes(children)
          .force('x-school',null)
          .force('y-school',null)
          .force('collide',null)
          .force('x-race',null)
          .force('y-race',null)
          .force('x-income',null)
          .force('y-income',null)
          .force('y-readiness',null)
          .force('one',isolate(d3.forceRadial(45, col1B, row1), function(d){ return d.DCNeighbNum === 1; }))
          .force('two',isolate(d3.forceRadial(45, col2B, row1), function(d){ return d.DCNeighbNum === 2; }))
          .force('three',isolate(d3.forceRadial(45, col3B, row1), function(d){ return d.DCNeighbNum === 3; }))
          .force('four',isolate(d3.forceRadial(45, col4B, row1), function(d){ return d.DCNeighbNum === 4; }))
          .force('five',isolate(d3.forceRadial(45, col5B, row1), function(d){ return d.DCNeighbNum === 5; }))
          .force('six',isolate(d3.forceRadial(45, col6B, row1), function(d){ return d.DCNeighbNum === 6; }))
          .force('seven',isolate(d3.forceRadial(45, col7B, row1), function(d){ return d.DCNeighbNum === 7; }))
          .force('eight',isolate(d3.forceRadial(45, col8B, row1), function(d){ return d.DCNeighbNum === 8; }))
          .force('nine',isolate(d3.forceRadial(45, col9B, row1), function(d){ return d.DCNeighbNum === 9; }))
          .force('charge',chargeForce);
          simulation.alpha(1).restart().on('end',function(){ console.log('end'); });
        } else if(chosenResPolicy == 'status quo'){
          simulation
            .nodes(children)
            .force('x-school',null)
            .force('y-school',null)
            .force('collide',null)
            .force('x-race',null)
            .force('y-race',null)
            .force('x-income',null)
            .force('y-income',null)
            .force('y-readiness',null)
            .force('one',isolate(d3.forceRadial(45, col1B, row1), function(d){ return d.statusQuoNeighbNum === 1; }))
            .force('two',isolate(d3.forceRadial(45, col2B, row1), function(d){ return d.statusQuoNeighbNum === 2; }))
            .force('three',isolate(d3.forceRadial(45, col3B, row1), function(d){ return d.statusQuoNeighbNum === 3; }))
            .force('four',isolate(d3.forceRadial(45, col4B, row1), function(d){ return d.statusQuoNeighbNum === 4; }))
            .force('five',isolate(d3.forceRadial(45, col5B, row1), function(d){ return d.statusQuoNeighbNum === 5; }))
            .force('six',isolate(d3.forceRadial(45, col6B, row1), function(d){ return d.statusQuoNeighbNum === 6; }))
            .force('seven',isolate(d3.forceRadial(45, col7B, row1), function(d){ return d.statusQuoNeighbNum === 7; }))
            .force('eight',isolate(d3.forceRadial(45, col8B, row1), function(d){ return d.statusQuoNeighbNum === 8; }))
            .force('nine',isolate(d3.forceRadial(45, col9B, row1), function(d){ return d.statusQuoNeighbNum === 9; }))
            .force('charge',chargeForce);
            simulation.alpha(1).restart().on('end',function(){ console.log('end'); });
        } else {
          simulation
            .nodes(children)
            .force('x-school',null)
            .force('y-school',null)
            .force('collide',null)
            .force('x-race',null)
            .force('y-race',null)
            .force('x-income',null)
            .force('y-income',null)
            .force('y-readiness',null)
            .force('one',isolate(d3.forceRadial(45, col1B, row1), function(d){ return d.LIHNeighbNum === 1; }))
            .force('two',isolate(d3.forceRadial(45, col2B, row1), function(d){ return d.LIHNeighbNum === 2; }))
            .force('three',isolate(d3.forceRadial(45, col3B, row1), function(d){ return d.LIHNeighbNum === 3; }))
            .force('four',isolate(d3.forceRadial(45, col4B, row1), function(d){ return d.LIHNeighbNum === 4; }))
            .force('five',isolate(d3.forceRadial(45, col5B, row1), function(d){ return d.LIHNeighbNum === 5; }))
            .force('six',isolate(d3.forceRadial(45, col6B, row1), function(d){ return d.LIHNeighbNum === 6; }))
            .force('seven',isolate(d3.forceRadial(45, col7B, row1), function(d){ return d.LIHNeighbNum === 7; }))
            .force('eight',isolate(d3.forceRadial(45, col8B, row1), function(d){ return d.LIHNeighbNum === 8; }))
            .force('nine',isolate(d3.forceRadial(45, col9B, row1), function(d){ return d.LIHNeighbNum === 9; }))
            .force('charge',chargeForce);
            simulation.alpha(1).restart().on('end',function(){ console.log('end'); });
        }
      });


    // School text
    var schoolTxt = textFull.append('div').attr('class','txt school-txt').style('margin-top',h*0.05+'px').style('display','none');
    schoolTxt.append('p').attr('class','page-title').text('ELEMENTARY SCHOOLS');
    schoolTxt.append('p').attr('class','body').text('Each neighborhood has an assigned neighborhood public school but you may have other options highlighted below.');
    schoolTxt.append('p').attr('class','prompt').text('Choose an elementary school for your child.');
    // var schoolTxtB = d3.select('#right-col-sm').append('div').attr('class','txt school-txt').style('margin-top',h*0.25+'px').style('display','none');
    // schoolTxtB.append('p').attr('class','prompt').text('Choose an elementary school for your child.');
    var schoolTxtC = textFull.append('div').attr('class','txt school-txt').style('margin-top',h*0.05+'px').style('display','none');
    schoolTxtC.append('p').attr('class','your').text('Your school choice.');
    var schoolTxtD = d3.select('#left-top').append('div').attr('class','txt school-txt').style('display','none');
    schoolTxtD.append('p').attr('class','body').style('text-align','right').text('[Something about what this choice means]');

    // Update the buttons and simulation on policy toggle
    d3.select('#SQ-assignment').on('click',function(d){
      d3.selectAll('.school-group').remove();
      createSQSchoolBtns();
    });

    d3.select('#CC-Chicago').on('click',function(d){
      d3.selectAll('.school-group').remove();
      createCCSchoolBtns();
    });

    d3.select('#full-attendance').on('click',function(d){
      // d3.selectAll('.school-group').remove();

        if(chosenResPolicy == 'diverse'){

            console.log('diverse assignment');
            // Don't need to draw the buttons?
            selectedNode.data()[0].DCSchoolAll = selectedNodeSch;
            // selectedNodeSqSchool = selectedNode.data()[0].DCSchoolAll;
            console.log(selectedNodeSqSchool);

            simulation
              .force('x-school',null)
              .force('y-school',null)
              .force('collide',null)
              .force('x-race',null)
              .force('y-race',null)
              .force('x-income',null)
              .force('y-income',null)
              .force('y-readiness',null)
              .force('one',isolate(d3.forceRadial(50, col1, row1), function(d){ return d.DCSchoolAll === 'SchAB'; }))
              .force('two',isolate(d3.forceRadial(50, col2, row1), function(d){ return d.DCSchoolAll === 'SchA'; }))
              .force('three',isolate(d3.forceRadial(50, col3, row1), function(d){ return d.DCSchoolAll === 'SchBH'; }))
              .force('four',isolate(d3.forceRadial(50, col1, row2), function(d){ return d.DCSchoolAll === 'SchBB'; }))
              .force('five',isolate(d3.forceRadial(50, col2, row2), function(d){ return d.DCSchoolAll === 'SchB'; }))
              .force('six',isolate(d3.forceRadial(50, col3, row2), function(d){ return d.DCSchoolAll === 'SchC'; }))
              .force('seven',isolate(d3.forceRadial(50, col1, row3), function(d){ return d.DCSchoolAll === 'SchCW'; }))
              .force('eight',isolate(d3.forceRadial(50, col2, row3), function(d){ return d.DCSchoolAll === 'SchD'; }))
              .force('nine',isolate(d3.forceRadial(50, col3, row3), function(d){ return d.DCSchoolAll === 'SchDW'; }))
              .force('charter',isolate(d3.forceRadial(50, col4, row2), function(d){ return d.DCSchoolAll === 'Charter'; }))
              .force('private',isolate(d3.forceRadial(50, col4, row3), function(d){ return d.DCSchoolAll === 'Private'; }))
              .force('charge',chargeForce);

            simulation.alpha(1).restart().on('end',function(){ console.log('end'); });

            d3.selectAll('.school-group').style('opacity',0.2).on('mouseenter',function(){d3.select(this).style('cursor','auto')});

            // // Draw the school buttons
            // schls = mainSvg.selectAll('.school-group').data(schools)
            //   .enter().append('g').attr('class','school-group').attr('text-anchor','middle')
            //   .attr('transform',function(d){ return 'translate('+ (schoolScaleX(d.actual)) +','+ (schoolScaleY(d.actual)) +')'})
            //   .on('click',function(d){
            //
            //     console.log(chosenResPolicy);
            //
            //     // selectedNode.data()[0].DCSchool = d.actual;
            //     selectedNode.data()[0].DCSchoolAll = 'Sch'+selectedNodeSqNum;
            //     selectedNodeSqSchool = selectedNode.data()[0].DCSchoolAll;
            //     d3.selectAll('.nbhd-group').remove();
            //     schoolTxt.style('display','none');
            //     schoolTxtB.style('display','none');
            //     schoolTxtC.style('display','block');
            //     schoolTxtD.style('display','block');
            //     finalBtn.style('display','block');
            //
            //     // Neighborhood sidebar text
            //     d3.select('.profile-school').html(selectedNodeSqSchool);
            //     d3.select('#change-school').style('visibility','visible');
            //
            //     })
            //     .on('mouseenter',function(d){
            //         var tooltiptext = function(d){ if(selectedNodeSqNum == d.sqNum){ return "your public school"; }
            //           else if (selectedNodeIncome >= 60000 & d.actual == 'Private'){ return "affordable"; }
            //           else if (selectedNodeIncome < 60000 & d.actual == 'Private'){ return "not affordable"; }
            //             else if (d.actual == 'Charter'){ return 'available'; }
            //               else{ return 'not available'; }
            //         };
            //         var tooltiptextfour = function(d){ return d.sqNeighbDescrC; };
            //         var tooltiptextfive = function(d){ return d.sqNeighbDescrD; };
            //         tooltip.transition().style('visibility','visible');
            //         if(d3.select(this).style('opacity') == 1) { d3.select(this).style('cursor','pointer') };
            //         tooltip.transition().style('visibility','visible');
            //         tooltip.style('left',schoolScaleX(d.actual)-120+'px').style('top',schoolScaleY(d.actual)+30+'px');
            //         tooltip.select('.tooltip-title').html(tooltiptext(d));
            //         tooltip.select('.tooltip-two').html(tooltiptextfour(d));
            //         tooltip.select('.tooltip-three').html(tooltiptextfive(d));
            //     })
            //     .on('mouseleave',function(d){
            //         tooltip.transition().style('visibility','hidden');
            //     });
            //
            //   schls.append('svg:image').attr('xlink:href',function(d){
            //     if(d.schType == 'Public'){ return './data/school_1007670.svg'; }
            //       else if (d.schType == 'Private'){ return './data/school_private_1095871.svg'; }
            //         else { return './data/school_charter_1095869.svg'; }
            //     })
            //     .style('width',60).attr('x',-30).attr('y',-30)
            //     .style('opacity',function(d){
            //       if(selectedNodeSqNum == d.sqNum){ return 1; }
            //         else if (selectedNodeIncome >= 60000 & d.actual == 'Private'){ return 1; }
            //           else if (d.actual == 'Charter'){ return 1; }
            //             else{ return 0.2; }
            //       });


          } else if (chosenResPolicy == 'status quo') {

            console.log('status quo assignment');
            // Don't need to draw the buttons?
            selectedNode.data()[0].statusQuoSchoolAll = selectedNodeSch;
            // selectedNodeSqSchool = selectedNode.data()[0].statusQuoSchoolAll;
            console.log(selectedNodeSqSchool);


            simulation
              .force('x-school',null)
              .force('y-school',null)
              .force('collide',null)
              .force('x-race',null)
              .force('y-race',null)
              .force('x-income',null)
              .force('y-income',null)
              .force('y-readiness',null)
              .force('one',isolate(d3.forceRadial(50, col1, row1), function(d){ return d.statusQuoSchoolAll === 'SchAB'; }))
              .force('two',isolate(d3.forceRadial(50, col2, row1), function(d){ return d.statusQuoSchoolAll === 'SchA'; }))
              .force('three',isolate(d3.forceRadial(50, col3, row1), function(d){ return d.statusQuoSchoolAll === 'SchBH'; }))
              .force('four',isolate(d3.forceRadial(50, col1, row2), function(d){ return d.statusQuoSchoolAll === 'SchBB'; }))
              .force('five',isolate(d3.forceRadial(50, col2, row2), function(d){ return d.statusQuoSchoolAll === 'SchB'; }))
              .force('six',isolate(d3.forceRadial(50, col3, row2), function(d){ return d.statusQuoSchoolAll === 'SchC'; }))
              .force('seven',isolate(d3.forceRadial(50, col1, row3), function(d){ return d.statusQuoSchoolAll === 'SchCW'; }))
              .force('eight',isolate(d3.forceRadial(50, col2, row3), function(d){ return d.statusQuoSchoolAll === 'SchD'; }))
              .force('nine',isolate(d3.forceRadial(50, col3, row3), function(d){ return d.statusQuoSchoolAll === 'SchDW'; }))
              .force('charter',isolate(d3.forceRadial(50, col4, row2), function(d){ return d.statusQuoSchoolAll === 'Charter'; }))
              .force('private',isolate(d3.forceRadial(50, col4, row3), function(d){ return d.statusQuoSchoolAll === 'Private'; }))
              .force('charge',chargeForce);

            simulation.alpha(1).restart().on('end',function(){ console.log('end'); });
            d3.selectAll('.school-group').style('opacity',0.2).on('mouseenter',function(){d3.select(this).style('cursor','auto')});

            // // Draw the school buttons
            // schls = mainSvg.selectAll('.school-group').data(schools)
            //   .enter().append('g').attr('class','school-group').attr('text-anchor','middle')
            //   .attr('transform',function(d){ return 'translate('+ (schoolScaleX(d.actual)) +','+ (schoolScaleY(d.actual)) +')'})
            //   .on('click',function(d){
            //
            //     console.log(chosenResPolicy);
            //
            //     // selectedNode.data()[0].statusQuoSchool = d.actual;
            //     selectedNode.data()[0].statusQuoSchoolAll = 'Sch'+selectedNodeSqNum;
            //     selectedNodeSqSchool = selectedNode.data()[0].statusQuoSchoolAll;
            //     d3.selectAll('.nbhd-group').remove();
            //     schoolTxt.style('display','none');
            //     schoolTxtB.style('display','none');
            //     schoolTxtC.style('display','block');
            //     schoolTxtD.style('display','block');
            //     finalBtn.style('display','block');
            //
            //     // Neighborhood sidebar text
            //     d3.select('.profile-school').html(selectedNodeSqSchool);
            //     d3.select('#change-school').style('visibility','visible');
            //
            //     simulation
            //       .force('x-school',null)
            //       .force('y-school',null)
            //       .force('collide',null)
            //       .force('x-race',null)
            //       .force('y-race',null)
            //       .force('x-income',null)
            //       .force('y-income',null)
            //       .force('y-readiness',null)
            //       .force('one',isolate(d3.forceRadial(50, col1, row1), function(d){ return d.statusQuoSchoolAll === 'SchAB'; }))
            //       .force('two',isolate(d3.forceRadial(50, col2, row1), function(d){ return d.statusQuoSchoolAll === 'SchA'; }))
            //       .force('three',isolate(d3.forceRadial(50, col3, row1), function(d){ return d.statusQuoSchoolAll === 'SchBH'; }))
            //       .force('four',isolate(d3.forceRadial(50, col1, row2), function(d){ return d.statusQuoSchoolAll === 'SchBB'; }))
            //       .force('five',isolate(d3.forceRadial(50, col2, row2), function(d){ return d.statusQuoSchoolAll === 'SchB'; }))
            //       .force('six',isolate(d3.forceRadial(50, col3, row2), function(d){ return d.statusQuoSchoolAll === 'SchC'; }))
            //       .force('seven',isolate(d3.forceRadial(50, col1, row3), function(d){ return d.statusQuoSchoolAll === 'SchCW'; }))
            //       .force('eight',isolate(d3.forceRadial(50, col2, row3), function(d){ return d.statusQuoSchoolAll === 'SchD'; }))
            //       .force('nine',isolate(d3.forceRadial(50, col3, row3), function(d){ return d.statusQuoSchoolAll === 'SchDW'; }))
            //       .force('charter',isolate(d3.forceRadial(50, col4, row2), function(d){ return d.statusQuoSchoolAll === 'Charter'; }))
            //       .force('private',isolate(d3.forceRadial(50, col4, row3), function(d){ return d.statusQuoSchoolAll === 'Private'; }))
            //       .force('charge',chargeForce);
            //
            //     simulation.alpha(1).restart().on('end',function(){ console.log('end'); });
            //     })
            //     .on('mouseenter',function(d){
            //       var tooltiptext = function(d){ if(selectedNodeSqNum == d.sqNum){ return "your public school"; }
            //         else if (selectedNodeIncome >= 60000 & d.actual == 'Private'){ return "affordable"; }
            //         else if (selectedNodeIncome < 60000 & d.actual == 'Private'){ return "not affordable"; }
            //           else if (d.actual == 'Charter'){ return 'available'; }
            //             else{ return 'not available'; }
            //       };
            //       var tooltiptextfour = function(d){ return d.sqNeighbDescrC; };
            //       var tooltiptextfive = function(d){ return d.sqNeighbDescrD; };
            //       tooltip.transition().style('visibility','visible');
            //         if(d3.select(this).style('opacity') == 1) { d3.select(this).style('cursor','pointer') };
            //         tooltip.transition().style('visibility','visible');
            //         tooltip.style('left',schoolScaleX(d.actual)-120+'px').style('top',schoolScaleY(d.actual)+30+'px');
            //         tooltip.select('.tooltip-title').html(tooltiptext(d));
            //         tooltip.select('.tooltip-two').html(tooltiptextfour(d));
            //         tooltip.select('.tooltip-three').html(tooltiptextfive(d));
            //     })
            //     .on('mouseleave',function(d){
            //         tooltip.transition().style('visibility','hidden');
            //     });
            //
            //   schls.append('svg:image').attr('xlink:href',function(d){
            //     if(d.schType == 'Public'){ return './data/school_1007670.svg'; }
            //       else if (d.schType == 'Private'){ return './data/school_private_1095871.svg'; }
            //         else { return './data/school_charter_1095869.svg'; }
            //     })
            //     .style('width',60).attr('x',-30).attr('y',-30)
            //     .style('opacity',function(d){
            //       if(selectedNodeSqNum == d.sqNum){ return 1; }
            //         else if (selectedNodeIncome >= 60000 & d.actual == 'Private'){ return 1; }
            //           else if (d.actual == 'Charter'){ return 1; }
            //             else{ return 0.2; }
            //       });

          } else {

            console.log('low income housing assignment');
            // Don't need to draw the buttons?
            selectedNode.data()[0].LIHSchoolAll = selectedNodeSch;
            // selectedNodeSqSchool = selectedNode.data()[0].LIHSchoolAll;
            console.log(selectedNodeSqSchool);


            simulation
              .force('x-school',null)
              .force('y-school',null)
              .force('collide',null)
              .force('x-race',null)
              .force('y-race',null)
              .force('x-income',null)
              .force('y-income',null)
              .force('y-readiness',null)
              .force('one',isolate(d3.forceRadial(50, col1, row1), function(d){ return d.LIHSchoolAll === 'SchAB'; }))
              .force('two',isolate(d3.forceRadial(50, col2, row1), function(d){ return d.LIHSchoolAll === 'SchA'; }))
              .force('three',isolate(d3.forceRadial(50, col3, row1), function(d){ return d.LIHSchoolAll === 'SchBH'; }))
              .force('four',isolate(d3.forceRadial(50, col1, row2), function(d){ return d.LIHSchoolAll === 'SchBB'; }))
              .force('five',isolate(d3.forceRadial(50, col2, row2), function(d){ return d.LIHSchoolAll === 'SchB'; }))
              .force('six',isolate(d3.forceRadial(50, col3, row2), function(d){ return d.LIHSchoolAll === 'SchC'; }))
              .force('seven',isolate(d3.forceRadial(50, col1, row3), function(d){ return d.LIHSchoolAll === 'SchCW'; }))
              .force('eight',isolate(d3.forceRadial(50, col2, row3), function(d){ return d.LIHSchoolAll === 'SchD'; }))
              .force('nine',isolate(d3.forceRadial(50, col3, row3), function(d){ return d.LIHSchoolAll === 'SchDW'; }))
              .force('charter',isolate(d3.forceRadial(50, col4, row2), function(d){ return d.LIHSchoolAll === 'Charter'; }))
              .force('private',isolate(d3.forceRadial(50, col4, row3), function(d){ return d.LIHSchoolAll === 'Private'; }))
              .force('charge',chargeForce);

            simulation.alpha(1).restart().on('end',function(){ console.log('end'); });
            d3.selectAll('.school-group').style('opacity',0.2).on('mouseenter',function(){d3.select(this).style('cursor','auto')});


            // // Draw the school buttons
            // schls = mainSvg.selectAll('.school-group').data(schools)
            //   .enter().append('g').attr('class','school-group').attr('text-anchor','middle')
            //   .attr('transform',function(d){ return 'translate('+ (schoolScaleX(d.actual)) +','+ (schoolScaleY(d.actual)) +')'})
            //   .on('click',function(d){
            //
            //     console.log(chosenResPolicy);
            //
            //     selectedNode.data()[0].LIHSchoolAll = 'Sch'+selectedNodeSqNum;
            //     selectedNodeSqSchool = selectedNode.data()[0].LIHSchoolAll;
            //     d3.selectAll('.nbhd-group').remove();
            //     schoolTxt.style('display','none');
            //     schoolTxtB.style('display','none');
            //     schoolTxtC.style('display','block');
            //     schoolTxtD.style('display','block');
            //     finalBtn.style('display','block');
            //
            //     // Neighborhood sidebar text
            //     d3.select('.profile-school').html(selectedNodeSqSchool);
            //     d3.select('#change-school').style('visibility','visible');
            //
            //     d3.select('.profile-school-segregation').html(schoolSegregation);
            //
            //
            //     simulation
            //       .force('x-school',null)
            //       .force('y-school',null)
            //       .force('collide',null)
            //       .force('x-race',null)
            //       .force('y-race',null)
            //       .force('x-income',null)
            //       .force('y-income',null)
            //       .force('y-readiness',null)
            //       .force('one',isolate(d3.forceRadial(50, col1, row1), function(d){ return d.LIHSchool === 'SchAB'; }))
            //       .force('two',isolate(d3.forceRadial(50, col2, row1), function(d){ return d.LIHSchool === 'SchA'; }))
            //       .force('three',isolate(d3.forceRadial(50, col3, row1), function(d){ return d.LIHSchool === 'SchBH'; }))
            //       .force('four',isolate(d3.forceRadial(50, col1, row2), function(d){ return d.LIHSchool === 'SchBB'; }))
            //       .force('five',isolate(d3.forceRadial(50, col2, row2), function(d){ return d.LIHSchool === 'SchB'; }))
            //       .force('six',isolate(d3.forceRadial(50, col3, row2), function(d){ return d.LIHSchool === 'SchC'; }))
            //       .force('seven',isolate(d3.forceRadial(50, col1, row3), function(d){ return d.LIHSchool === 'SchCW'; }))
            //       .force('eight',isolate(d3.forceRadial(50, col2, row3), function(d){ return d.LIHSchool === 'SchD'; }))
            //       .force('nine',isolate(d3.forceRadial(50, col3, row3), function(d){ return d.LIHSchool === 'SchDW'; }))
            //       .force('charter',isolate(d3.forceRadial(50, col4, row2), function(d){ return d.LIHSchool === 'Charter'; }))
            //       .force('private',isolate(d3.forceRadial(50, col4, row3), function(d){ return d.LIHSchool === 'Private'; }))
            //       .force('charge',chargeForce);
            //
            //     simulation.alpha(1).restart().on('end',function(){ console.log('end'); });
            //     })
            //     .on('mouseenter',function(d){
            //         var tooltiptext = function(d){ if(selectedNodeSqNum == d.sqNum){ return "your public school"; }
            //           else if (selectedNodeIncome >= 60000 & d.actual == 'Private'){ return "affordable"; }
            //           else if (selectedNodeIncome < 60000 & d.actual == 'Private'){ return "not affordable"; }
            //             else if (d.actual == 'Charter'){ return 'available'; }
            //               else{ return 'not available'; }
            //         };
            //         var tooltiptextfour = function(d){ return d.sqNeighbDescrC; };
            //         var tooltiptextfive = function(d){ return d.sqNeighbDescrD; };
            //         tooltip.transition().style('visibility','visible');
            //         if(d3.select(this).style('opacity') == 1) { d3.select(this).style('cursor','pointer') };
            //         tooltip.transition().style('visibility','visible');
            //         tooltip.style('left',schoolScaleX(d.actual)-120+'px').style('top',schoolScaleY(d.actual)+30+'px');
            //         tooltip.select('.tooltip-title').html(tooltiptext(d));
            //         tooltip.select('.tooltip-two').html(tooltiptextfour(d));
            //         tooltip.select('.tooltip-three').html(tooltiptextfive(d));
            //     })
            //     .on('mouseleave',function(d){
            //         tooltip.transition().style('visibility','hidden');
            //     });
            //
            //   schls.append('svg:image').attr('xlink:href',function(d){
            //     if(d.schType == 'Public'){ return './data/school_1007670.svg'; }
            //       else if (d.schType == 'Private'){ return './data/school_private_1095871.svg'; }
            //         else { return './data/school_charter_1095869.svg'; }
            //     })
            //     .style('width',60).attr('x',-30).attr('y',-30)
            //     .style('opacity',function(d){
            //       if(selectedNodeSqNum == d.sqNum){ return 1; }
            //         else if (selectedNodeIncome >= 60000 & d.actual == 'Private'){ return 1; }
            //           else if (d.actual == 'Charter'){ return 1; }
            //             else{ return 0.2; }
            //       });

              };
    });

    var createSQSchoolBtns = function(){

      if(chosenResPolicy == 'diverse'){

        console.log('diverse assignment');
        // Draw the school buttons
        schls = mainSvg.selectAll('.school-group').data(schools)
          .enter().append('g').attr('class','school-group').attr('text-anchor','middle')
          .attr('transform',function(d){ return 'translate('+ (schoolScaleX(d.actual)) +','+ (schoolScaleY(d.actual)) +')'})
          .on('click',function(d){

            console.log(chosenResPolicy);

            draw()

            selectedNode.data()[0].DCSchool = d.actual;
            selectedNodeSqSchool = selectedNode.data()[0].DCSchool;
            // d3.selectAll('.nbhd-group').remove();
            schoolTxt.style('display','none');
            // schoolTxtB.style('display','none');
            schoolTxtC.style('display','block');
            schoolTxtD.style('display','block');
            finalBtn.style('display','block');
            schoolPolicyButtons.style('display','inline-block');

            // Neighborhood sidebar text
            d3.select('.profile-school').html(selectedNodeSqSchool);
            d3.select('#change-school').style('visibility','visible');

            simulation
              .force('x-school',null)
              .force('y-school',null)
              .force('collide',null)
              .force('x-race',null)
              .force('y-race',null)
              .force('x-income',null)
              .force('y-income',null)
              .force('y-readiness',null)
              .force('one',isolate(d3.forceRadial(50, col1B, row2B), function(d){ return d.DCSchool === 'SchAB'; }))
              .force('two',isolate(d3.forceRadial(50, col2B, row2B), function(d){ return d.DCSchool === 'SchA'; }))
              .force('three',isolate(d3.forceRadial(50, col3B, row2B), function(d){ return d.DCSchool === 'SchBH'; }))
              .force('four',isolate(d3.forceRadial(50, col4B, row2B), function(d){ return d.DCSchool === 'SchBB'; }))
              .force('five',isolate(d3.forceRadial(50, col5B, row2B), function(d){ return d.DCSchool === 'SchB'; }))
              .force('six',isolate(d3.forceRadial(50, col6B, row2B), function(d){ return d.DCSchool === 'SchC'; }))
              .force('seven',isolate(d3.forceRadial(50, col7B, row2B), function(d){ return d.DCSchool === 'SchCW'; }))
              .force('eight',isolate(d3.forceRadial(50, col8B, row2B), function(d){ return d.DCSchool === 'SchD'; }))
              .force('nine',isolate(d3.forceRadial(50, col9B, row2B), function(d){ return d.DCSchool === 'SchDW'; }))
              .force('charter',isolate(d3.forceRadial(50, col4B, row3B), function(d){ return d.DCSchool === 'Charter'; }))
              .force('private',isolate(d3.forceRadial(50, col6B, row3B), function(d){ return d.DCSchool === 'Private'; }))
              .force('charge',chargeForce);

            simulation.alpha(1).restart().on('end',function(){ console.log('end'); });
            })
            .on('mouseenter',function(d){
                var tooltiptext = function(d){ if(selectedNodeSqNum == d.sqNum){ return "your public school"; }
                  else if (selectedNodeIncome >= 60000 & d.actual == 'Private'){ return "affordable"; }
                  else if (selectedNodeIncome < 60000 & d.actual == 'Private'){ return "not affordable"; }
                    else if (d.actual == 'Charter'){ return 'available'; }
                      else{ return 'not available'; }
                };
                var tooltiptextfour = function(d){ return d.sqNeighbDescrC; };
                var tooltiptextfive = function(d){ return d.sqNeighbDescrD; };
                tooltip.transition().style('visibility','visible');
                if(d3.select(this).style('opacity') == 1) { d3.select(this).style('cursor','pointer') };
                tooltip.transition().style('visibility','visible');
                tooltip.style('left',schoolScaleX(d.actual)-160+'px').style('top',schoolScaleY(d.actual)+30+'px');
                tooltip.select('.tooltip-title').html(tooltiptext(d));
                tooltip.select('.tooltip-two').html(tooltiptextfour(d));
                tooltip.select('.tooltip-three').html(tooltiptextfive(d));
            })
            .on('mouseleave',function(d){
                tooltip.transition().style('visibility','hidden');
            });

          schls.append('svg:image').attr('xlink:href',function(d){
            if(d.schType == 'Public'){ return './data/school_1007670.svg'; }
              else if (d.schType == 'Private'){ return './data/school_private_1095871.svg'; }
                else { return './data/school_charter_1095869.svg'; }
            })
            .style('width',40).attr('x',-20).attr('y',-30)
            .style('opacity',function(d){
              if(selectedNodeSqNum == d.sqNum){ return 1; }
                else if (selectedNodeIncome >= 60000 & d.actual == 'Private'){ return 1; }
                  else if (d.actual == 'Charter'){ return 1; }
                    else{ return 0.2; }
              });
          // schls.append('text').text(function(d){ return d.schType; }).attr('class','graph-label')
          //   .attr('x',0).attr('y',0).attr('text-anchor','middle').style('fill','#000000').style('alignment-baseline','middle');


      } else if (chosenResPolicy == 'status quo') {

        console.log('status quo assignment');
        // Draw the school buttons
        schls = mainSvg.selectAll('.school-group').data(schools)
          .enter().append('g').attr('class','school-group').attr('text-anchor','middle')
          .attr('transform',function(d){ return 'translate('+ (schoolScaleX(d.actual)) +','+ (schoolScaleY(d.actual)) +')'})
          .on('click',function(d){

            console.log(chosenResPolicy);

            draw()

            selectedNode.data()[0].statusQuoSchool = d.actual;
            selectedNodeSqSchool = selectedNode.data()[0].statusQuoSchool;
            // d3.selectAll('.nbhd-group').remove();
            schoolTxt.style('display','none');
            // schoolTxtB.style('display','none');
            schoolTxtC.style('display','block');
            schoolTxtD.style('display','block');
            finalBtn.style('display','block');
            schoolPolicyButtons.style('display','inline-block');

            // Neighborhood sidebar text
            d3.select('.profile-school').html(selectedNodeSqSchool);
            d3.select('#change-school').style('visibility','visible');

            simulation
              .force('x-school',null)
              .force('y-school',null)
              .force('collide',null)
              .force('x-race',null)
              .force('y-race',null)
              .force('x-income',null)
              .force('y-income',null)
              .force('y-readiness',null)
              .force('one',isolate(d3.forceRadial(50, col1B, row2B), function(d){ return d.statusQuoSchool === 'SchAB'; }))
              .force('two',isolate(d3.forceRadial(50, col2B, row2B), function(d){ return d.statusQuoSchool === 'SchA'; }))
              .force('three',isolate(d3.forceRadial(50, col3B, row2B), function(d){ return d.statusQuoSchool === 'SchBH'; }))
              .force('four',isolate(d3.forceRadial(50, col4B, row2B), function(d){ return d.statusQuoSchool === 'SchBB'; }))
              .force('five',isolate(d3.forceRadial(50, col5B, row2B), function(d){ return d.statusQuoSchool === 'SchB'; }))
              .force('six',isolate(d3.forceRadial(50, col6B, row2B), function(d){ return d.statusQuoSchool === 'SchC'; }))
              .force('seven',isolate(d3.forceRadial(50, col7B, row2B), function(d){ return d.statusQuoSchool === 'SchCW'; }))
              .force('eight',isolate(d3.forceRadial(50, col8B, row2B), function(d){ return d.statusQuoSchool === 'SchD'; }))
              .force('nine',isolate(d3.forceRadial(50, col9B, row2B), function(d){ return d.statusQuoSchool === 'SchDW'; }))
              .force('charter',isolate(d3.forceRadial(50, col4B, row3B), function(d){ return d.statusQuoSchool === 'Charter'; }))
              .force('private',isolate(d3.forceRadial(50, col6B, row3B), function(d){ return d.statusQuoSchool === 'Private'; }))
              .force('charge',chargeForce);

            simulation.alpha(1).restart().on('end',function(){ console.log('end'); });
            })
            .on('mouseenter',function(d){
              var tooltiptext = function(d){ if(selectedNodeSqNum == d.sqNum){ return "your public school"; }
                else if (selectedNodeIncome >= 60000 & d.actual == 'Private'){ return "affordable"; }
                else if (selectedNodeIncome < 60000 & d.actual == 'Private'){ return "not affordable"; }
                  else if (d.actual == 'Charter'){ return 'available'; }
                    else{ return 'not available'; }
              };
              var tooltiptextfour = function(d){ return d.sqNeighbDescrC; };
              var tooltiptextfive = function(d){ return d.sqNeighbDescrD; };
              tooltip.transition().style('visibility','visible');
                if(d3.select(this).style('opacity') == 1) { d3.select(this).style('cursor','pointer') };
                tooltip.transition().style('visibility','visible');
                tooltip.style('left',schoolScaleX(d.actual)-120+'px').style('top',schoolScaleY(d.actual)+30+'px');
                tooltip.select('.tooltip-title').html(tooltiptext(d));
                tooltip.select('.tooltip-two').html(tooltiptextfour(d));
                tooltip.select('.tooltip-three').html(tooltiptextfive(d));
            })
            .on('mouseleave',function(d){
                tooltip.transition().style('visibility','hidden');
            });

          schls.append('svg:image').attr('xlink:href',function(d){
            if(d.schType == 'Public'){ return './data/school_1007670.svg'; }
              else if (d.schType == 'Private'){ return './data/school_private_1095871.svg'; }
                else { return './data/school_charter_1095869.svg'; }
            })
            .style('width',60).attr('x',-30).attr('y',-30)
            .style('opacity',function(d){
              if(selectedNodeSqNum == d.sqNum){ return 1; }
                else if (selectedNodeIncome >= 60000 & d.actual == 'Private'){ return 1; }
                  else if (d.actual == 'Charter'){ return 1; }
                    else{ return 0.2; }
              });

      } else {

        console.log('low income housing assignment');
        // Draw the school buttons
        schls = mainSvg.selectAll('.school-group').data(schools)
          .enter().append('g').attr('class','school-group').attr('text-anchor','middle')
          .attr('transform',function(d){ return 'translate('+ (schoolScaleX(d.actual)) +','+ (schoolScaleY(d.actual)) +')'})
          .on('click',function(d){

            console.log(chosenResPolicy);

            draw()

            selectedNode.data()[0].statusQuoSchool = d.actual;
            selectedNodeSqSchool = selectedNode.data()[0].statusQuoSchool;
            // d3.selectAll('.nbhd-group').remove();
            schoolTxt.style('display','none');
            // schoolTxtB.style('display','none');
            schoolTxtC.style('display','block');
            schoolTxtD.style('display','block');
            finalBtn.style('display','block');
            schoolPolicyButtons.style('display','inline-block');

            // Neighborhood sidebar text
            d3.select('.profile-school').html(selectedNodeSqSchool);
            d3.select('#change-school').style('visibility','visible');

            d3.select('.profile-school-segregation').html(schoolSegregation);


            simulation
              .force('x-school',null)
              .force('y-school',null)
              .force('collide',null)
              .force('x-race',null)
              .force('y-race',null)
              .force('x-income',null)
              .force('y-income',null)
              .force('y-readiness',null)
              .force('one',isolate(d3.forceRadial(50, col1B, row2B), function(d){ return d.LIHSchool === 'SchAB'; }))
              .force('two',isolate(d3.forceRadial(50, col2B, row2B), function(d){ return d.LIHSchool === 'SchA'; }))
              .force('three',isolate(d3.forceRadial(50, col3B, row2B), function(d){ return d.LIHSchool === 'SchBH'; }))
              .force('four',isolate(d3.forceRadial(50, col4B, row2B), function(d){ return d.LIHSchool === 'SchBB'; }))
              .force('five',isolate(d3.forceRadial(50, col5B, row2B), function(d){ return d.LIHSchool === 'SchB'; }))
              .force('six',isolate(d3.forceRadial(50, col6B, row2B), function(d){ return d.LIHSchool === 'SchC'; }))
              .force('seven',isolate(d3.forceRadial(50, col7B, row2B), function(d){ return d.LIHSchool === 'SchCW'; }))
              .force('eight',isolate(d3.forceRadial(50, col8B, row2B), function(d){ return d.LIHSchool === 'SchD'; }))
              .force('nine',isolate(d3.forceRadial(50, col9B, row2B), function(d){ return d.LIHSchool === 'SchDW'; }))
              .force('charter',isolate(d3.forceRadial(50, col4B, row3B), function(d){ return d.LIHSchool === 'Charter'; }))
              .force('private',isolate(d3.forceRadial(50, col6B, row3B), function(d){ return d.LIHSchool === 'Private'; }))
              .force('charge',chargeForce);

            simulation.alpha(1).restart().on('end',function(){ console.log('end'); });
            })
            .on('mouseenter',function(d){
                var tooltiptext = function(d){ if(selectedNodeSqNum == d.sqNum){ return "your public school"; }
                  else if (selectedNodeIncome >= 60000 & d.actual == 'Private'){ return "affordable"; }
                  else if (selectedNodeIncome < 60000 & d.actual == 'Private'){ return "not affordable"; }
                    else if (d.actual == 'Charter'){ return 'available'; }
                      else{ return 'not available'; }
                };
                var tooltiptextfour = function(d){ return d.sqNeighbDescrC; };
                var tooltiptextfive = function(d){ return d.sqNeighbDescrD; };
                tooltip.transition().style('visibility','visible');
                if(d3.select(this).style('opacity') == 1) { d3.select(this).style('cursor','pointer') };
                tooltip.transition().style('visibility','visible');
                tooltip.style('left',schoolScaleX(d.actual)-120+'px').style('top',schoolScaleY(d.actual)+30+'px');
                tooltip.select('.tooltip-title').html(tooltiptext(d));
                tooltip.select('.tooltip-two').html(tooltiptextfour(d));
                tooltip.select('.tooltip-three').html(tooltiptextfive(d));
            })
            .on('mouseleave',function(d){
                tooltip.transition().style('visibility','hidden');
            });

          schls.append('svg:image').attr('xlink:href',function(d){
            if(d.schType == 'Public'){ return './data/school_1007670.svg'; }
              else if (d.schType == 'Private'){ return './data/school_private_1095871.svg'; }
                else { return './data/school_charter_1095869.svg'; }
            })
            .style('width',60).attr('x',-30).attr('y',-30)
            .style('opacity',function(d){
              if(selectedNodeSqNum == d.sqNum){ return 1; }
                else if (selectedNodeIncome >= 60000 & d.actual == 'Private'){ return 1; }
                  else if (d.actual == 'Charter'){ return 1; }
                    else{ return 0.2; }
              });

      };

    }

    var createCCSchoolBtns = function(){

    }

    var createFASchoolBtns = function(){

    }




    // Final button
    var finalBtn = d3.select('#continue-final');
    finalBtn.on('click',function(){
      console.log('call detail final')
      var finalData = []
      var detailFinalSvg = d3.select('#detail-final');
      var detailFinal = DetailFinal();
      detailFinalSvg.datum(finalData).call(detailFinal);
      d3.select('#detail-final').style('visibility','visible');
      });


    // Refresh button
    var refreshBtn = d3.select('#refresh-btn');
    refreshBtn.on('click',function(){ location.reload(true); });

    var reset = function(){
      // Things to show
      nodes.transition().style('visibility','visible');

      // Things to remove
      incomeTxt.style('display','none');
      educationBtn.style('display','none');
      neighborhoodBtnA.style('display','none');
      neighborhoodBtnB.style('display','none');
      neighborhoodTxt.style('display','none');
      educationTxt.style('display','none');
      d3.select('.income-axis').remove();
      schoolTxt.style('display','none');
      d3.selectAll('.school-group').remove();
      d3.selectAll('.nbhd-group').remove();
      context.clearRect(0, 0, w, h); // Clear the canvas.
      incomeBtn.style('display','none');
      raceTxtA.style('display','none');
      raceTxtB.style('display','none');
      raceTxtC.style('display','none');
      raceTxtD.style('display','none');

      simulation
        .force('x-school',null)
        .force('y-school',null)
        .force('collide',null)
        .force('x-race',null)
        .force('y-race',null)
        .force('x-income',null)
        .force('y-income',null)
        .force('y-readiness',null)
        .force('one',null)
        .force('two',null)
        .force('three',null)
        .force('four',null)
        .force('five',null)
        .force('six',null)
        .force('seven',null)
        .force('eight',null)
        .force('nine',null)
        .force('charter',null)
        .force('private',null)
        .force('charge',null);
    }

    // Change race button
    d3.select('#change-race').on('click',function(){
      console.log('change race');
      reset();
      // Things to show
      incomeBtn.style('display','block');
      raceTxtA.style('display','block');
      raceTxtB.style('display','block');
      raceTxtC.style('display','block');
      raceTxtD.style('display','block');
      nodes.transition().style('visibility','visible');
      simulation
        .force('collide',collideForce)
        .force('x-race',raceXForce)
        .force('y-race',raceYForce);
      simulation.alpha(1).restart().on('end',function(){ console.log('end'); });
    });

    // Change income button
    d3.select('#change-income').on('click',function(){
      console.log('change income');
      reset();
      // Things to show
      incomeTxt.style('display','block');
      educationBtn.style('display','block');
      // Add axis
      mainSvg.append('g').attr('class','income-axis').attr('transform','translate('+ 0 +','+ ((h/2)+150) +')').call(income_X_Axis);
      simulation
        .force('x-income',incomeXForce)
        .force('y-income',incomeYForce)
        .force('collide',collideForce)
      simulation.alpha(1).restart().on('end',function(){ console.log('end'); });
    });

    // Change education button
    d3.select('#change-income').on('click',function(){
      console.log('change education');
      reset();
    });

    // Change neighborhood
    d3.select('#change-neighborhood').on('click',function(){
      console.log('change neighborhood');
      reset();
      nodes.transition().style('visibility','hidden');
      neighborhoodTxt.style('display','block');
      createNeighborhoodBtns();
    });

    // Change school
    d3.select('#change-school').on('click',function(){
      console.log('change school');
      reset();
      createSchoolBtns();
      simulation
        .force('collide',collideForce)
        .force('x-neighborhood',neighborhoodXForce)
        .force('y-neighborhood',neighborhoodYForce);
      simulation.alpha(1).restart().on('end',function(){ console.log('end'); });
    });

  }

  return exports;

}
