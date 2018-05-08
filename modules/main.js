console.log('main');

function Main(){
  var m = {t:50,r:50,b:50,l:50},
      raceY = h*0.45,
      incomeY = h*0.5,
      neighborhoodY = h/4,
      schoolY = h*0.45,
      textY = h/10,
      n = 500,
      m = 5,
      neighborhoodSegregation,
      schoolSegregation,
      degrees = 180/Math.PI,
      selected,
      selectedAcademic,
      selectedNonAcademic,
      selectedAcademic_Balanced,
      selectedNonAcademic_Balanced,
      selectedSch,
      selectionTxt,
      schls,
      incomeGraph,
      nodeReadiness;
  // Neighborhood placement
  var col1,col2,col3,col4,row1,row2,row3;
  // Second neighborhood placement
  var col1B,col2B,col3B,col4B,col5B,col6B,col7B;

  var dispatcher = d3.dispatch('update');
  var profile = Profile();
  var results = Results();
  var tooltip = d3.select('.custom-tooltip');
  var addlOption1 = Math.floor(Math.random() * 10)+1;
  var addlOption2 = Math.floor(Math.random() * 10)+1;

  // Scales
  var scaleColor = d3.scaleOrdinal().domain(['White','Black','Hispanic']).range(['#00ccff','#cc00ff','#66ff33']);
  var scaleSegregation = d3.scaleLinear().domain([0,100]).range(['red','green']);
  var raceScaleX = d3.scaleOrdinal().domain(['White','Black','Hispanic']);
  var incomeScaleX = d3.scaleLinear().domain([0,200000]);
  var readinessScale = d3.scaleOrdinal().domain([1,2]).range([1,0.4]);
  var readinessScaleY = d3.scaleOrdinal().domain([1,2]);
  var incomeScaleY = d3.scaleOrdinal().domain(['White','Black','Hispanic']);
  var nbhdScaleX = d3.scaleOrdinal();
  var nbhdScaleX_B = d3.scaleOrdinal();
  var nbhdScaleY = d3.scaleOrdinal();
  var schoolScaleX = d3.scaleOrdinal();
  var schoolScaleX_B = d3.scaleOrdinal();
  var schoolScaleY = d3.scaleOrdinal();
  var segregationScaleX = d3.scaleLinear().domain([0,100]);


  // Axis
  var income_X_Axis = d3.axisBottom().scale(incomeScaleX).tickFormat(d3.format('$,'));

  // Mapping
  var projection = d3.geoAlbersUsa(),
      projectionPath = d3.geoPath().projection(projection);

  var map,
      mapNested;
  d3.queue()
    .defer(d3.csv,'./data/zone_data.csv')
  	.await(dataLoaded);

  function dataLoaded(err, mapData){
    // console.log(mapData);
    d3.json('./data/cps_attendance_zones.json', function(json){

      for (var i=0; i < mapData.length; i++) {
        // Grab zone ID
        var zoneID = mapData[i].school_id;
        // Grab zone code
        var neighborhoodValue = mapData[i].Combo;
        var blackValue = mapData[i].BlackAvg;
        var whiteValue = mapData[i].WhiteAvg;
        var hispanicValue = mapData[i].HispanicAvg;
        var incomeValue = mapData[i].AvgIncome;
        // Find the corresponding zone in the json
        for (var j=0; j<json.features.length; j++) {
          var jsonZone = json.features[j].properties.school_id;
          if (zoneID == jsonZone) {
            // Copy the data value into the json
            json.features[j].properties.value = neighborhoodValue;
            json.features[j].properties.black = +blackValue;
            json.features[j].properties.white = +whiteValue;
            json.features[j].properties.hispanic = +hispanicValue;
            json.features[j].properties.income = +incomeValue;
            break;// Stop looking through the json
          }
        }
      }
      map = json;
      mapNested = d3.nest().key(function(d){ return d.properties.value; }).entries(map.features);
    });
  }


  //  ************ BEGINNING OF EXPORTS SECTION ************
  var exports = function(selection){

    var children = selection.datum()[0];
    var schools = selection.datum()[1];
    var population = selection.datum()[2];
    var schoolsNested = d3.nest().key(function(d){ return d.schType; }).entries(schools);
    var neighborhoods = schoolsNested.filter(function(d){ return d.key === 'Public'});

    var w = w || selection.node().clientWidth,
        h = h || selection.node().clientHeight;

    var mainSvg = selection.append('svg').attr('width',w).attr('height',h);

    var canvas = selection.append('canvas')
      .attr('class','canvas')
      .attr('width',w)
      .attr('height',h);

    var context = canvas.node().getContext('2d');
    context.clearRect(0, 0, w, h); // Clear the canvas.

    // Set up simulation
    var chargeForce = d3.forceManyBody().strength(-1),
        collideForce = d3.forceCollide().radius(function(d){ return d.radius + w*0.002; }),
        raceXForce = d3.forceX().x(function(d){ return raceScaleX(d.race) }),
        raceYForce = d3.forceY().y(raceY),
        incomeXForce = d3.forceX().x(function(d){ return incomeScaleX(d.income) }).strength(1),
        incomeYForce = d3.forceY().y(function(d){ return incomeScaleY(d.race) }),
        schoolXForce = d3.forceX().x(function(d){ return schoolScaleX(d.statusQuoSchool); }),
        schoolYForce = d3.forceY().y(function(d){ return schoolScaleY(d.statusQuoSchool)+75; });
        readinessYForce = d3.forceY().y(function(d){ return readinessScaleY(d.readiness)+h*0.025; });

    // Base simulation
    var simulation = d3.forceSimulation().force('collide',collideForce),
        delay = function(d,i){ return i * 50; };

    // // Set up voronoi
    // var voronoi = d3.voronoi()
    //     .extent([[0, 0], [w, h]])
    //     .x(function(d) { return d.x; })
    //     .y(function(d) { return d.y; });
    //
    // var voronoiGroup = mainSvg.append("g")
    //     .attr('class','voronoi').on('click',introClick).on('mouseover', highlightNode).on('mouseout', unhighlightNode);
    //
    //
    // simulation
    //   .nodes(children)
    //   .on('tick',function(){
    //     nodes.attr('transform',function(d){ return 'translate('+ d.x+','+ d.y+')' });
    //     voronoi.x(function(d){ return d.x; }).y(function(d){ return d.y; });
    //     voronoiGroup.selectAll('path').data(voronoi(children).polygons()).enter().append('path');
    //     voronoiGroup.selectAll('path').attr('d',function(d){ return d ? 'M' + d.join('L') + 'Z' : null; });
    //   });
    //   simulation.stop();
      function isolate(force, filter) {
        var initialize = force.initialize;
        force.initialize = function(){ initialize.call(force, children.filter(filter)); };
        return force;
      }
    //
    //   function highlightNode(d) {
    //     var element = d3.selectAll('.voronoi' + d.data.num);
    //     element.style('opacity',1);
    //   }
    //
    //   function unhighlightNode(d,i){
    //     var element = d3.selectAll('.voronoi' + d.data.num);
    //     element.style('opacity',0.25);
    //   }
    //
    //   function introClick(d){
    //     voronoiGroup.on('click',null);
    //     voronoiGroup.on('mouseover',null);
    //     voronoiGroup.on('mouseleave',null);
    //     selected = children[d.data.index];
    //     for (var i=0; i < children.length; i++) { children[i].radius = 2; };
    //     selected.radius = 8;
    //     nodeReadiness = selected.readiness === 1 ? 'ready' : 'not ready';
    //     d3.selectAll('.circle')
    //       .style('fill',function(d){ return scaleColor(d.race); })
    //       .style('opacity',.4).attr('r',function(d){return d.radius;});
    //
    //     // Selection text
    //     introTxtB.style('display','block');
    //     introTxtB.selectAll('p').remove();
    //     introTxtB.selectAll('.inner').remove();
    //     introTxtB.append('p').attr('class','your').text('Your child is ' + selected.race).style('display','block');
    //     d3.select(this).select('.circle').style('opacity',1);
    //     introTxtA.style('display','none');
    //     raceBtn.style('display','inline-block');
    //     simulation
    //       .nodes(children)
    //       .on('tick',function(){ nodes.attr('transform',function(d){ return 'translate('+ d.x+','+ d.y+')' }); })
    //       .force('intro',d3.forceRadial(w*0.25, w/2, h/2))
    //       .force('collide-large',d3.forceCollide().radius(function(d){ return d.radius + 4; }))
    //       .force('charge',chargeForce);
    //       simulation.alpha(1).restart();
    //   }

    // ************ DRAW NODES ************
    var nodes = mainSvg.selectAll('.node').data(children)
      .enter().append('g')
      .attr('class','node')
      .attr('transform',function(d){ return 'translate('+ d.x +','+ d.y +')' })
      .on('click',function(d){
        console.log(d.num);
        selected = children[d.index];
        for (var i=0; i < children.length; i++) { children[i].radius = w*0.002; };
        selected.radius = w*0.008;
        nodeReadiness = selected.readiness === 1 ? 'ready' : 'not ready';
        d3.selectAll('.circle')
          .style('fill',function(d){ return scaleColor(d.race); })
          .style('opacity',.4).attr('r',function(d){return d.radius;});

        // Selection text
        introTxtB.style('display','block');
        introTxtB.selectAll('p').remove();
        introTxtB.selectAll('.inner').remove();
        introTxtB.append('p').attr('class','your').text('Your child is ' + selected.race).style('display','block');
        d3.select(this).select('.circle').style('opacity',1);
        introTxtA.style('display','none');
        raceBtn.style('display','inline-block');
        simulation
          .nodes(children)
          .force('intro',d3.forceRadial(w*0.25, w/2, h/2))
          .force('collide-large',d3.forceCollide().radius(function(d){ return d.radius + w*0.003; }))
          .force('charge',chargeForce);
          simulation.alpha(1).restart();
      })
      .on('mouseenter', function(d){ d3.select(this).select('.circle').attr('r',w*0.008); })
      .on('mouseleave', function(d){
        d3.select(this).select('.circle').attr('r',d.radius);
      });

    nodes.append('circle')
      .attr('class',function(d){ return 'circle voronoi' + d.num; })
      .attr('r',w*0.002)
      .style('fill','#E8E8E8')
      .style('cursor','pointer')
      .attr('opacity',.25);

    nodes.exit().remove();

    simulation
      .nodes(children)
      .on('tick',function(){ nodes.attr('transform',function(d){ return 'translate('+ d.x+','+ d.y+')' }); })
      .force('intro',d3.forceRadial(w*0.25, w/2, h/2))
      .force('collide-large',d3.forceCollide().radius(function(d){ return d.radius + w*0.003; }))
      .force('charge',chargeForce);

      simulation.alpha(1).restart()
        .on('end',function(){ console.log('end'); });

    // Draw the canvas circle
    function draw() {
      console.log('draw');

      d3.selectAll('.circle').each(function(d,i){
        console.log('draw circle');
        var contextNode = d3.select(this);
        context.fillStyle = contextNode.style('fill');
        context.globalAlpha = contextNode.style('opacity');
        context.globalAlpha = 0.2;
        context.beginPath();
        context.arc(this.getCTM().e, this.getCTM().f, contextNode.attr('r'), 0, Math.PI*2);
        context.fill();
      })
    }



    // ************ TEXT & BUTTON CODE ************

    var textDiv = d3.select('#container'),
        textFull = d3.select('#full'),
        textThird1 = d3.select('#third-1'),
        textThird2 = d3.select('#third-2'),
        textThird3 = d3.select('#third-3'),
        sidebarProfile = d3.select('#image'),
        sidebarRace = d3.select('#race'),
        sidebarIncome = d3.select('#income'),
        resPolicyButtons = d3.select('#residential-policy-buttons'),
        schoolPolicyButtons = d3.select('#assignment-policy-buttons'),
        learnMoreRace = d3.select('#learn-more-race'),
        learnMoreRes = d3.select('#learn-more-residence'),
        learnMoreSchool = d3.select('#learn-more-school'),
        sidebar = d3.select('#sidebar').append('svg').attr('class','sidebar');

    //Append a defs (for definition) element to your SVG
    var defs = sidebar.append("defs");

    //Append a linearGradient element to the defs and give it a unique id
    var linearGradient = defs.append("linearGradient")
        .attr("id", "linear-gradient");

    //Horizontal gradient
    linearGradient
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "0%");

      //Set the color for the start (0%)
    linearGradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "red"); //red

    //Set the color for the end (100%)
    linearGradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "green"); //green

    var key = mainSvg.append('g').attr('transform','translate('+40+','+h*0.93+')').attr('x',40).attr('y',h*0.97);

    learnMoreRace.on('click',function(){ d3.select('#detail-pop').style('visibility','visible'); });
    learnMoreRes.on('click',function(){ d3.select('#detail-res').style('visibility','visible'); });
    learnMoreSchool.on('click',function(){ d3.select('#detail-school').style('visibility','visible'); });


    // Intro text
    var introTxtA = textFull.append('div').attr('class','txt introA-txt').style('margin-top',h*0.4+'px');
    introTxtA.append('p').attr('class','title').text('EDUCATE YOUR CHILD');
    introTxtA.append('p').attr('class','body').style('margin-top',20+'px').html('The Chicago public school system has a high level of school segregation  </br> as a result of parents\' residential and school choices as well as policy decisions </br> that do not encourage integrated neighborhoods and schools. </br>  </br> In this game, you are a parent of a 5-year-old child and now you have  </br> to make some decisions. Explore how your choices can have an impact  </br> on your child\'s education and on the overall education of the city\'s children.');
    introTxtA.append('p').attr('class','prompt').text('Select a dot to begin').style('margin-top','50px');
    var introTxtB = textFull.append('div').attr('class','txt introB-txt').style('margin-top',h*0.45+'px').style('display','none');


    // Race button
    var raceBtn = d3.select('#continue-race');
    raceBtn.on('click',function(){
        w = w - 180; // Change the width of the main area
        mainSvg.attr('width',w).attr('height',h);
        d3.selectAll('.bottom-buttons').style('width',w+'px').style('top','90vh');
        textDiv.style('width',w+'px');
        d3.selectAll('.circle').style('opacity',1);
        nodes.on('click',null);
        nodes.on('mouseenter',null);
        nodes.on('mouseleave',null);
        d3.select(this).transition().style('display','none');
        introTxtB.style('display','none');
        incomeBtn.style('display','inline-block');
        raceTxtA.style('display','block');
        raceTxtB.style('visibility','visible');
        // learnMoreRace.style('display','block');
        raceScaleX.range([(w*0.25),(w/2),(w*0.75)]);
        incomeScaleX.range([w/7,(w/5)*4.25]);
        readinessScaleY.range([incomeY-(h*0.07),incomeY+(h*0.07)]);
        incomeScaleY.range([incomeY-(h*0.15),incomeY,incomeY+(h*0.15)]);
        segregationScaleX.range([10,115]);
        projection.fitExtent([[w*0.55,h*0.25],[w*0.90,h*0.8]],map);// Map projection
        d3.select('#sidebar').style('visibility','visible');
        sidebarProfile.append('img').attr('src',function(d){
          if(selected.race == 'Black'){ return './data/black.png'; }
          else if(selected.race == 'Hispanic'){ return './data/hispanic.png'; }
          else{ return './data/white.png'; }
        }).attr('width',80).attr('x',0).attr('y',0);
        // Race sidebar text
        d3.select('.profile-race').html(selected.race);
        d3.select('#race').style('opacity',1);
        d3.select('#image').style('opacity',1);

        simulation
          .force('intro',null)
          .force('collide-large',null)
          .force('x-race',raceXForce)
          .force('y-race',raceYForce)
          .force('collide',collideForce);
        simulation.alpha(1).restart();

        // Key
        key.append('circle').attr('cx',0).attr('cy',0).attr('r',3).style('fill','#00ccff')
        key.append('text').attr('x',8).attr('y',3).attr('class','body-sm').style('text-align','left').style('fill','#00ccff').text('White');
        key.append('circle').attr('cx',60).attr('cy',0).attr('r',3).style('fill','#cc00ff')
        key.append('text').attr('x',68).attr('y',3).attr('class','body-sm').style('text-align','left').style('fill','#cc00ff').text('Black');
        key.append('circle').attr('cx',120).attr('cy',0).attr('r',3).style('fill','#66ff33')
        key.append('text').attr('x',128).attr('y',3).attr('class','body-sm').style('text-align','left').style('fill','#66ff33').text('Hispanic');

        raceTxtB.append('text').attr('class','body').text('17% of children are White').attr('x',w*0.25).attr('text-anchor','middle').style('fill','#00ccff');
        raceTxtB.append('text').attr('class','body').text('35% of children are Black').attr('x',w*0.5).attr('text-anchor','middle').style('fill','#cc00ff');
        raceTxtB.append('text').attr('class','body').text('43% of children are Hispanic').attr('x',w*0.75).attr('text-anchor','middle').style('fill','#66ff33');
      });


    // Race text
    var raceTxtA = textFull.append('div').attr('class','txt race-txt').style('margin-top',h*0.05+'px').style('display','none');
    raceTxtA.append('p').attr('class','page-title').text("CHICAGO'S DEMOGRAPHICS");
    raceTxtA.append('p').attr('class','body')
      .html('Like several other large cities, Chicago has a significant minority presence. </br> The population of the city is 35% white, 33% Hispanic (non-white), and 32% black. </br> However, there are far fewer white residents with children. </br> This makes school integration efforts difficult.');
    raceTxtA.append('p').attr('class','body').style('margin-top',h*0.12+'px').style('margin-bottom',h*0.025+'px')
      .text('Of the city\'s elementary school age children:');

    var raceTxtB = mainSvg.append('g').attr('transform','translate('+ 0 +','+ (h*0.6) +')').style('visibility','hidden');


    // Income button
    var incomeBtn = d3.select('#continue-income');
    incomeBtn.on('click',function(){
        d3.select(this).transition().style('display','none');
        raceTxtA.style('display','none');
        raceTxtB.style('visibility','hidden');
        incomeTxt.style('display','block');
        educationBtn.style('display','inline-block');
        // learnMoreRace.style('display','none');

        // Add axis and median lines
        incomeGraph = mainSvg.append('g');
        incomeGraph.append('g').attr('class','income-axis').attr('transform','translate('+ 0 +','+ (h*0.75) +')').call(income_X_Axis);
        incomeGraph.append('line').attr('class','median')
          .attr('x1',incomeScaleX(75416)).attr('x2',incomeScaleX(75416)).attr('y1',incomeScaleY('White')-45).attr('y2',incomeScaleY('White')+15)
          .style('stroke','#00ccff').style('stroke-width',1).style('opacity',0.75);
        incomeGraph.append('line').attr('class','median')
          .attr('x1',incomeScaleX(43530)).attr('x2',incomeScaleX(43530)).attr('y1',incomeScaleY('Hispanic')-50).attr('y2',incomeScaleY('Hispanic')+70)
          .style('stroke','#66ff33').style('stroke-width',1).style('opacity',0.75);
        incomeGraph.append('line').attr('class','median')
          .attr('x1',incomeScaleX(30193)).attr('x2',incomeScaleX(30193)).attr('y1',incomeScaleY('Black')-60).attr('y2',incomeScaleY('Black')+50)
          .style('stroke','#cc00ff').style('stroke-width',1).style('opacity',0.75);

        // Race labels
        incomeGraph.append('text').attr('class','axis-text').attr('x',incomeScaleX(75416)+8).attr('y',incomeScaleY('White')-35).style('fill','#00ccff').text('White Household Median: $75,416');
        incomeGraph.append('text').attr('class','axis-text').attr('x',incomeScaleX(30193)+8).attr('y',incomeScaleY('Black')-50).style('fill','#cc00ff').text('Black Household Median: $30,193');
        incomeGraph.append('text').attr('class','axis-text').attr('x',incomeScaleX(43530)+8).attr('y',incomeScaleY('Hispanic')-40).style('fill','#66ff33').text('Hispanic Household Median: $43,530');

        // Income sidebar text
        d3.select('.profile-income').html(d3.format('$,')(selected.income));
        d3.select('.node-income').html('Your household income is '+d3.format('$,')(selected.income));
        d3.select('#income').style('opacity',1);

        simulation
          .force('x-race',null)
          .force('y-race',null)
          .force('collide',collideForce)
          .force('x-income',incomeXForce)
          .force('y-income',incomeYForce);
        simulation.alpha(1).restart().on('end',function(){ console.log('end'); });
      });

    // Income text
    var incomeTxt = textFull.append('div').attr('class','txt income-txt').style('margin-top',h*0.05+'px').style('display','none');
    incomeTxt.append('p').attr('class','page-title').text('WHAT IS YOUR HOUSEHOLD INCOME?');
    incomeTxt.append('p').attr('class','your node-income');
    incomeTxt.append('p').attr('class','body').html('The median household income in Chicago is $46,255 and race/ethnicity is strongly linked to class.');


    // Education button
    var educationBtn = d3.select('#continue-education');
    educationBtn.on('click',function(){

        var readyNodes = d3.selectAll('.circle').filter(function(d){ return d.readiness === 2});
        readyNodes.transition().style('stroke',function(d){ return scaleColor(d.race); }).style('stroke-width',0.5).style('fill','#202020');
        d3.select(this).transition().style('display','none');
        incomeTxt.style('display','none');
        neighborhoodBtnA.style('display','inline-block');
        educationTxt.style('display','block');
        d3.selectAll('.axis-text').remove();
        d3.selectAll('.median').remove();
        // Race labels
        incomeGraph.append('text').attr('class','axis-text')
          .attr('x',(w/7)-30).attr('y',incomeY-(h*0.06)).style('fill','#E8E8E8').style('text-anchor','end').text('Ready');
        incomeGraph.append('text').attr('class','axis-text')
          .attr('x',(w/7)-30).attr('y',incomeY+(h*0.12)).style('opacity',0.4).style('fill','#E8E8E8').style('text-anchor','end').text('Not Ready');

        // Education sidebar text
        d3.select('.profile-readiness').html(nodeReadiness);
        d3.select('#education').style('opacity',1);
        d3.select('#change-education').style('visibility','visible');
        d3.select('.node-education').html('Your child is '+nodeReadiness+' for school');

        // Key
        key.append('circle').attr('cx',250).attr('cy',0).attr('r',3).style('fill','#E8E8E8')
        key.append('text').attr('x',260).attr('y',3).attr('class','body-sm').style('text-align','left').style('fill','#E8E8E8').text('Ready');
        key.append('circle').attr('cx',320).attr('cy',0).attr('r',3).style('fill','#202020').style('stroke-width',0.5).style('stroke','#E8E8E8')
        key.append('text').attr('x',330).attr('y',3).attr('class','body-sm').style('text-align','left').style('fill','#E8E8E8').text('Not Ready');

        simulation
          .force('y-income',null)
          .force('y-readiness',readinessYForce);
        simulation.alpha(1).restart();
      });

    // Education text
    var educationTxt = textFull.append('div').attr('class','txt education-txt').style('margin-top',h*0.05+'px').style('display','none');
    educationTxt.append('p').attr('class','page-title').text('IS YOUR CHILD READY FOR SCHOOL?');
    educationTxt.append('p').attr('class','your node-education');
    educationTxt.append('p').attr('class','body').html('School readiness is based on early math and reading skills and overall health. </br> One important way that children become "school ready" is through Pre-K. </br> School ready children tend to have more success in grade school </br> and a higher likelihood of completing high school. </br> Fewer than half of poor children are school ready at age five </br> but exposure to "school ready" children can have a positive effect.');

    // Neighborhood buttons
    var neighborhoodBtnA = d3.select('#continue-neighborhood-A');
    neighborhoodBtnA.on('click',function(){

        d3.select(this).transition().style('display','none');
        educationTxt.style('display','none');
        d3.select('.income-axis').transition().style('display','none');
        incomeGraph.style('visibility','hidden');
        neighborhoodTxt.style('display','block');
        resPolicyButtons.style('display','block').style('width',w+'px');
        nodes.style('visibility','hidden');

        var zones = mainSvg.selectAll('.zone')
          .data(map.features)
          .enter().append('path')
          .attr('class',function(d){ return 'zone zone'+d.properties.value; })
          .attr('d',projectionPath)
          .style('fill','#202020').style('stroke','#E8E8E8')
          .style('stroke-weight',0.25).style('stroke-opacity',0.3);

        // Neighborhood/school placement
        col1 = (w*0.15);
        col2 = (w*0.29);
        col3 = (w*0.43);
        col4 = (w*0.57);

        row1 = (h*0.30); // Rows stay the same
        row2 = (h*0.50);
        row3 = (h*0.70);

        // Second neighborhood/school placement
        col1B = (w*0.15);
        col2B = (w*0.23);
        col3B = (w*0.383);
        col4B = (w*0.463);
        col5B = (w*0.617);
        col6B = (w*0.697);
        col7B = (w*0.85);

        nbhdScaleX.domain(['1','2','3','4','5','6','7','8','9']).range([col1,col2,col3,col1,col2,col3,col1,col2,col3]);
        nbhdScaleX_B.domain(['1','2','3','4','5','6','7','8','9']).range([col1B,col3B,col5B,col1B,col3B,col5B,col1B,col3B,col5B]);
        nbhdScaleY.domain(['1','2','3','4','5','6','7','8','9']).range([row1,row1,row1,row2,row2,row2,row3,row3,row3]);

        schoolScaleX.domain(['SchAB','SchA','SchBH','SchBB','SchB','SchC','SchCW','SchD','SchDW','Charter','Private']).range([col2B,col4B,col6B,col2B,col4B,col6B,col2B,col4B,col6B,col7B,col7B]);
        schoolScaleX_B.domain(['SchAB','SchA','SchBH','SchBB','SchB','SchC','SchCW','SchD','SchDW','Charter','Private']).range([col1,col2,col3,col1,col2,col3,col1,col2,col3,col4,col4]);
        schoolScaleY.domain(['SchAB','SchA','SchBH','SchBB','SchB','SchC','SchCW','SchD','SchDW','Charter','Private']).range([row1,row1,row1,row2,row2,row2,row3,row3,row3,row1,row2]);
      });

    // Update the buttons and simulation on policy toggle
    d3.select('#LI-residential').on('click',function(d){
      d3.selectAll('.nbhd-group').remove();
      resPolicyButtons.style('display','none');
      createLINeighborhoodBtns();
      // learnMoreRes.style('display','inline-block');
    });

    d3.select('#SQ-residential').on('click',function(d){
      d3.selectAll('.nbhd-group').remove();
      resPolicyButtons.style('display','none');
      createSQNeighborhoodBtns();
      // learnMoreRes.style('display','inline-block');
    });

    // Neighborhood text
    var neighborhoodTxt = textFull.append('div').attr('class','txt neighborhood-txt').style('margin-top',h*0.05+'px').style('display','none');
    neighborhoodTxt.append('p').attr('class','page-title').text('NEIGHBORHOOD');
    neighborhoodTxt.append('p').attr('class','body').text('You can afford to live in the highlighted neighborhood types.');
    neighborhoodTxt.append('p').attr('class','prompt').text('Choose a neighborhood type to live in.');

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
        .attr('transform',function(d){ return 'translate('+ nbhdScaleX(d.sqNum) +','+ nbhdScaleY(d.sqNum) +')' })
        .on('click',function(d){ if(selected.statusQuoNeighbNum >= d.sqNum){

          selectedHouse = d3.select(this);
          console.log(selected);
          selected.statusQuoNeighbNum = d.sqNum;
          selected.DCNeighbNum = d.sqNum;
          selectedSch = d.neighborhood;
          nodes.style('visibility','visible');
          neighborhoodBtnB.style('display','inline-block');
          neighborhoodTxt.style('display','none');
          d3.selectAll('.zone').remove();
          selected.statusQuoNeighbNum = d.sqNum;

          // Neighborhood sidebar text
          d3.select('.profile-neighborhood').html(selected.statusQuoNeighbNum);
          d3.select('#neighborhood').style('opacity',1);
          d3.select('#change-neighborhood').style('visibility','visible');
          d3.select('#residential-segregation').style('opacity',1);

          if(d.sqNum <= selected.statusQuoNeighbNum-2 & selected.income >= 100000){
            selected.DCNeighbNum = d.sqNum;
            console.log('diverse choice');
            selected.statusQuoNeighbNum = d.sqNum;
            neighborhoodSegregation = 68;
            // neighborhoodSegregation = 'W/B: 66.3' + '<br/>' + 'W/H: 38.4';
            d3.select('.profile-residential-segregation').html(neighborhoodSegregation);

            neighborhoodTxtB.style('display','block').select('p').html('You chose neighborhood '+selected.statusQuoNeighbNum+', <br/> an economically and racially diverse choice');
            neighborhoodTxtC.style('display','block').select('p').html('The Entropy index is a measurement of segregation of two or more groups. A level of 100 would indicate a city whose neighborhoods each reflected the make-up of the city as a whole. Chicago is one of the most segregated cities in the country and its current level is 57. A small increase in low-income housing could increase that number by 9 points and over several generations, this could lead to a much more significant decrease in the level of segregation. If more residents chose racially or socioeconomically diverse neighborhoods, the segregation level would also improve.');

            chosenResPolicy = 'diverse';

            simulation
              .nodes(children)
              .force('x-school',null)
              .force('y-school',null)
              // .force('collide',null)
              .force('x-race',null)
              .force('y-race',null)
              .force('x-income',null)
              .force('y-income',null)
              .force('y-readiness',null)
              .force('intro',null)
              .force('collide-large',null)
              .force('collide',collideForce)
              .force('one',isolate(d3.forceRadial(w*0.04, col1, row1), function(d){ return d.DCNeighbNum === 1; }))
              .force('two',isolate(d3.forceRadial(w*0.04, col2, row1), function(d){ return d.DCNeighbNum === 2; }))
              .force('three',isolate(d3.forceRadial(w*0.04, col3, row1), function(d){ return d.DCNeighbNum === 3; }))
              .force('four',isolate(d3.forceRadial(w*0.04, col1, row2), function(d){ return d.DCNeighbNum === 4; }))
              .force('five',isolate(d3.forceRadial(w*0.04, col2, row2), function(d){ return d.DCNeighbNum === 5; }))
              .force('six',isolate(d3.forceRadial(w*0.04, col3, row2), function(d){ return d.DCNeighbNum === 6; }))
              .force('seven',isolate(d3.forceRadial(w*0.04, col1, row3), function(d){ return d.DCNeighbNum === 7; }))
              .force('eight',isolate(d3.forceRadial(w*0.04, col2, row3), function(d){ return d.DCNeighbNum === 8; }))
              .force('nine',isolate(d3.forceRadial(w*0.04, col3, row3), function(d){ return d.DCNeighbNum === 9; }))
              .force('charge',chargeForce);

              simulation.alpha(1).restart()
                .on('end',function(){ console.log('end'); });

          } else {
            console.log('not diverse choice');
            selected.statusQuoNeighbNum = d.sqNum;
            selected.statusQuoNeighbNum = d.sqNum;
            neighborhoodSegregation = 57;
            d3.select('.profile-residential-segregation').html(neighborhoodSegregation);
            neighborhoodTxtB.style('display','block').select('p')
              .html(selected.income >= 50000 ? 'You chose neighborhood '+selected.statusQuoNeighbNum+', <br/> a choice that maintains residential segregation' : 'You chose neighborhood '+selected.statusQuoNeighbNum);
            neighborhoodTxtC.style('display','block').select('p').html('The Entropy index is a measurement of segregation of two or more groups. A level of 100 would indicate a city whose neighborhoods each reflected the make-up of the city as a whole. Chicago is one of the most segregated cities in the country and its current level is 57. A small increase in low-income housing could increase that number by 9 points and over several generations, this could lead to a much more significant decrease in the level of segregation. If more residents chose racially or socioeconomically diverse neighborhoods, the segregation level would also improve.');
            chosenResPolicy = 'status quo';
            selectedHouse = d3.select(this);

            simulation
              .nodes(children)
              .force('x-school',null)
              .force('y-school',null)
              // .force('collide',null)
              .force('x-race',null)
              .force('y-race',null)
              .force('x-income',null)
              .force('y-income',null)
              .force('y-readiness',null)
              .force('collide',collideForce)
              .force('one',isolate(d3.forceRadial(w*0.04, col1, row1), function(d){ return d.statusQuoNeighbNum === 1; }))
              .force('two',isolate(d3.forceRadial(w*0.04, col2, row1), function(d){ return d.statusQuoNeighbNum === 2; }))
              .force('three',isolate(d3.forceRadial(w*0.04, col3, row1), function(d){ return d.statusQuoNeighbNum === 3; }))
              .force('four',isolate(d3.forceRadial(w*0.04, col1, row2), function(d){ return d.statusQuoNeighbNum === 4; }))
              .force('five',isolate(d3.forceRadial(w*0.04, col2, row2), function(d){ return d.statusQuoNeighbNum === 5; }))
              .force('six',isolate(d3.forceRadial(w*0.04, col3, row2), function(d){ return d.statusQuoNeighbNum === 6; }))
              .force('seven',isolate(d3.forceRadial(w*0.04, col1, row3), function(d){ return d.statusQuoNeighbNum === 7; }))
              .force('eight',isolate(d3.forceRadial(w*0.04, col2, row3), function(d){ return d.statusQuoNeighbNum === 8; }))
              .force('nine',isolate(d3.forceRadial(w*0.04, col3, row3), function(d){ return d.statusQuoNeighbNum === 9; }))
              .force('charge',chargeForce);

              simulation.alpha(1).restart()
                .on('end',function(){ console.log('end'); });
          }


          sidebar.append('rect')
            .attr('x',segregationScaleX(0)).attr('y',h*0.565).attr('width',90).attr('height',1)
            .style('fill','url(#linear-gradient)');
          sidebar.append('circle').attr('cx',segregationScaleX(neighborhoodSegregation))
            .attr('cy',h*0.565).attr('r',5).style('fill',scaleSegregation(neighborhoodSegregation))
            .style('stroke','#333333').style('stroke-width',1);


        }})
        .on('mouseenter',function(d){
            var tooltiptext = function(d){ if(selected.statusQuoNeighbNum >= d.sqNum){ return 'Affordable'; } else { return 'Not Affordable'; } };
            var tooltiptexttwo = function(d){ return d.sqNeighbDescrA; };
            var tooltiptextthree = function(d){ return d.sqNeighbDescrB; };
            var tooltiptextfour = function(d){ return d.sqNeighbDescrC; };
            var tooltiptextfive = function(d){ return d.sqNeighbDescrD; };
            var highlight = d3.selectAll('.zone'+d.neighborhood);
            highlight.transition().style('fill','#e8e8e8');
            if(selected.statusQuoNeighbNum >= d.sqNum) { d3.select(this).style('cursor','pointer') };
            tooltip.transition().style('visibility','visible');
            // tooltip.style('left',nbhdScaleX(d.sqNum)+40+'px').style('top',nbhdScaleY(d.sqNum)-40+'px');
            tooltip.select('.tooltip-title').html(tooltiptext(d));
            tooltip.select('.tooltip-two').html(tooltiptexttwo(d));
            tooltip.select('.tooltip-three').html(tooltiptextthree(d));
            tooltip.select('.tooltip-four').html(tooltiptextfour(d));
            tooltip.select('.tooltip-five').html(tooltiptextfive(d));
        })
        .on('mousemove',function(d){
            var xy = d3.mouse(mainSvg.node());
            tooltip.style('left',xy[0]-110+'px').style('top',xy[1]+20+'px');
        })
        .on('mouseleave',function(d){
            var highlight = d3.selectAll('.zone'+d.neighborhood);
            highlight.transition().style('fill','#202020');
            tooltip.transition().style('visibility','hidden');
        });

      nbhds.append('svg:image').attr('xlink:href','./data/house.png').attr('height',h*0.055).attr('width',h*0.055).attr('x',-(h*0.04)).attr('y',-(h*0.04))
        .attr('class','nbhd-image').style('opacity',function(d){ if(selected.statusQuoNeighbNum >= d.sqNum){ return 1; } else { return 0.2; } });
    }

    var createLINeighborhoodBtns = function(){

      // Draw the neighborhood buttons
      var nbhds = mainSvg.selectAll('.nbhd-group').data(neighborhoods[0].values)
        .enter().append('g').attr('class','nbhd-group')
        .attr('transform',function(d){ return 'translate('+ nbhdScaleX(d.sqNum) +','+ nbhdScaleY(d.sqNum) +')' })
        .on('click',function(d){ if(selected.statusQuoNeighbNum >= d.sqNum || ((d.sqNum == 7 || d.sqNum == 8) & selected.income <= 50000)){

          selectedHouse = d3.select(this);

          neighborhoodSegregation = 66;
          selected.LIHNeighbNum = d.sqNum;
          selected.LIHNeighbNum = selected.LIHNeighbNum;
          selected.statusQuoNeighbNum = d.sqNum;

          nodes.style('visibility','visible');
          neighborhoodBtnB.style('display','inline-block');
          neighborhoodTxt.style('display','none');
          selectedSch = d.neighborhood;
          d3.selectAll('.zone').remove();


          // Neighborhood sidebar text
          d3.select('.profile-neighborhood').html(selected.statusQuoNeighbNum);
          d3.select('.profile-residential-segregation').html(neighborhoodSegregation);
          d3.select('#neighborhood').style('opacity',1);
          d3.select('#change-neighborhood').style('visibility','visible');
          d3.select('#residential-segregation').style('opacity',1);

          sidebar.append('rect')
            .attr('x',segregationScaleX(0)).attr('y',h*0.565).attr('width',90).attr('height',1)
            .style('fill','url(#linear-gradient)');
          sidebar.append('circle').attr('cx',segregationScaleX(neighborhoodSegregation))
            .attr('cy',h*0.565).attr('r',5).style('fill',scaleSegregation(neighborhoodSegregation))
            .style('stroke','#333333').style('stroke-width',1);


          neighborhoodTxtB.style('display','block').select('p').html('You chose neighborhood '+selected.statusQuoNeighbNum+', <br/> and to advocate for more low-income housing');
          neighborhoodTxtC.style('display','block').select('p').html('The Entropy index is a measurement of segregation of two or more groups. A level of 100 would indicate a city whose neighborhoods each reflected the make-up of the city as a whole. Chicago is one of the most segregated cities in the country and its current level is 57. A small increase in low-income housing could increase that number by 9 points and over several generations, this could lead to a much more significant decrease in the level of segregation. If more residents chose racially or socioeconomically diverse neighborhoods, the segregation level would also improve.');

          chosenResPolicy = 'low income';

          simulation
          .force('x-school',null)
          .force('y-school',null)
          // .force('collide',null)
          .force('x-race',null)
          .force('y-race',null)
          .force('x-income',null)
          .force('y-income',null)
          .force('y-readiness',null)
          .force('collide',collideForce)
          .force('one',isolate(d3.forceRadial(w*0.04, col1, row1), function(d){ return d.LIHNeighbNum === 1; }))
          .force('two',isolate(d3.forceRadial(w*0.04, col2, row1), function(d){ return d.LIHNeighbNum === 2; }))
          .force('three',isolate(d3.forceRadial(w*0.04, col3, row1), function(d){ return d.LIHNeighbNum === 3; }))
          .force('four',isolate(d3.forceRadial(w*0.04, col1, row2), function(d){ return d.LIHNeighbNum === 4; }))
          .force('five',isolate(d3.forceRadial(w*0.04, col2, row2), function(d){ return d.LIHNeighbNum === 5; }))
          .force('six',isolate(d3.forceRadial(w*0.04, col3, row2), function(d){ return d.LIHNeighbNum === 6; }))
          .force('seven',isolate(d3.forceRadial(w*0.04, col1, row3), function(d){ return d.LIHNeighbNum === 7; }))
          .force('eight',isolate(d3.forceRadial(w*0.04, col2, row3), function(d){ return d.LIHNeighbNum === 8; }))
          .force('nine',isolate(d3.forceRadial(w*0.04, col3, row3), function(d){ return d.LIHNeighbNum === 9; }))
          .force('charge',chargeForce);

          simulation.alpha(1).restart()
            .on('end',function(){
              console.log('end');
            });

        }})
        .on('mouseenter',function(d){
            var tooltiptext = function(d){ if(selected.statusQuoNeighbNum >= d.sqNum || ((d.sqNum == 7 || d.sqNum == 8) & selected.income <= 50000)){ return 'Affordable'; } else { return 'Not Affordable'; } };
            var tooltiptexttwo = function(d){ return d.sqNeighbDescrA; };
            var tooltiptextthree = function(d){ return d.sqNeighbDescrB; };
            var tooltiptextfour = function(d){ return d.sqNeighbDescrC; };
            var tooltiptextfive = function(d){ return d.sqNeighbDescrD; };
            var highlight = d3.selectAll('.zone'+d.neighborhood);
            highlight.transition().style('fill','#e8e8e8');
            if(selected.LIHNeighbNum >= d.sqNum || ((d.sqNum == 7 || d.sqNum == 8) & selected.income <= 50000)) {
              d3.select(this).style('cursor','pointer')
            };
            tooltip.transition().style('visibility','visible');
            // tooltip.style('left',nbhdScaleX(d.sqNum)-120+'px').style('top',nbhdScaleY(d.sqNum)+30+'px');
            tooltip.select('.tooltip-title').html(tooltiptext(d));
            tooltip.select('.tooltip-two').html(tooltiptexttwo(d));
            tooltip.select('.tooltip-three').html(tooltiptextthree(d));
            tooltip.select('.tooltip-four').html(tooltiptextfour(d));
            tooltip.select('.tooltip-five').html(tooltiptextfive(d));
        })
        .on('mousemove',function(d){
            var xy = d3.mouse(mainSvg.node());
            tooltip.style('left',xy[0]-110+'px').style('top',xy[1]+20+'px');
        })
        .on('mouseleave',function(d){
          var highlight = d3.selectAll('.zone'+d.neighborhood);
          highlight.transition().style('fill','#202020');
          tooltip.transition().style('visibility','hidden');
        });

      nbhds.append('svg:image').attr('class','nbhd-image').attr('xlink:href','./data/house.png').attr('height',h*0.055).attr('width',h*0.055).attr('x',-(h*0.04)).attr('y',-(h*0.04))
        .style('opacity',function(d){ if(selected.statusQuoNeighbNum >= d.sqNum || ((d.sqNum == 7 || d.sqNum == 8) & selected.income <= 50000)){ return 1; } else { return 0.2; } });
    }

    // Neighborhood buttons
    var neighborhoodBtnB = d3.select('#continue-neighborhood-B');
    neighborhoodBtnB.on('click',function(){
      d3.selectAll('.nbhd-image').style('opacity',0.2);
      selectedHouse.style('opacity',1);
      resPolicyButtons.style('display','none');
      neighborhoodTxt.style('display','none');
      schoolTxt.style('display','block');
      // learnMoreSchool.style('display','inline-block');
      neighborhoodTxtB.style('display','none');
      neighborhoodTxtC.style('display','none');
      neighborhoodBtnB.style('display','none');
      learnMoreRes.style('display','none');
      console.log(selectedHouse);

      createSQSchoolBtns();

      // Move the neighborhoods
      d3.selectAll('.nbhd-group').transition().attr('transform',function(d){ return 'translate('+ nbhdScaleX_B(d.sqNum) +','+ nbhdScaleY(d.sqNum) +')' });
      d3.selectAll('.nbhd-group').on('mouseenter',null).on('click',null);

      // Move the dots
      if(chosenResPolicy == 'diverse'){
        simulation
          .nodes(children)
          .force('x-school',null)
          .force('y-school',null)
          // .force('collide',null)
          .force('x-race',null)
          .force('y-race',null)
          .force('x-income',null)
          .force('y-income',null)
          .force('y-readiness',null)
          .force('collide',collideForce)
          .force('one',isolate(d3.forceRadial(w*0.04, col1B, row1), function(d){ return d.DCNeighbNum === 1; }))
          .force('two',isolate(d3.forceRadial(w*0.04, col3B, row1), function(d){ return d.DCNeighbNum === 2; }))
          .force('three',isolate(d3.forceRadial(w*0.04, col5B, row1), function(d){ return d.DCNeighbNum === 3; }))
          .force('four',isolate(d3.forceRadial(w*0.04, col1B, row2), function(d){ return d.DCNeighbNum === 4; }))
          .force('five',isolate(d3.forceRadial(w*0.04, col3B, row2), function(d){ return d.DCNeighbNum === 5; }))
          .force('six',isolate(d3.forceRadial(w*0.04, col5B, row2), function(d){ return d.DCNeighbNum === 6; }))
          .force('seven',isolate(d3.forceRadial(w*0.04, col1B, row3), function(d){ return d.DCNeighbNum === 7; }))
          .force('eight',isolate(d3.forceRadial(w*0.04, col3B, row3), function(d){ return d.DCNeighbNum === 8; }))
          .force('nine',isolate(d3.forceRadial(w*0.04, col5B, row3), function(d){ return d.DCNeighbNum === 9; }))
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
            .force('collide',collideForce)
            .force('one',isolate(d3.forceRadial(w*0.04, col1B, row1), function(d){ return d.statusQuoNeighbNum === 1; }))
            .force('two',isolate(d3.forceRadial(w*0.04, col3B, row1), function(d){ return d.statusQuoNeighbNum === 2; }))
            .force('three',isolate(d3.forceRadial(w*0.04, col5B, row1), function(d){ return d.statusQuoNeighbNum === 3; }))
            .force('four',isolate(d3.forceRadial(w*0.04, col1B, row2), function(d){ return d.statusQuoNeighbNum === 4; }))
            .force('five',isolate(d3.forceRadial(w*0.04, col3B, row2), function(d){ return d.statusQuoNeighbNum === 5; }))
            .force('six',isolate(d3.forceRadial(w*0.04, col5B, row2), function(d){ return d.statusQuoNeighbNum === 6; }))
            .force('seven',isolate(d3.forceRadial(w*0.04, col1B, row3), function(d){ return d.statusQuoNeighbNum === 7; }))
            .force('eight',isolate(d3.forceRadial(w*0.04, col3B, row3), function(d){ return d.statusQuoNeighbNum === 8; }))
            .force('nine',isolate(d3.forceRadial(w*0.04, col5B, row3), function(d){ return d.statusQuoNeighbNum === 9; }))
            .force('charge',chargeForce);
            simulation.alpha(1).restart().on('end',function(){ console.log('end'); });
        } else {
          simulation
            .nodes(children)
            .force('x-school',null)
            .force('y-school',null)
            // .force('collide',null)
            .force('x-race',null)
            .force('y-race',null)
            .force('x-income',null)
            .force('y-income',null)
            .force('y-readiness',null)
            .force('collide',collideForce)
            .force('one',isolate(d3.forceRadial(w*0.04, col1B, row1), function(d){ return d.LIHNeighbNum === 1; }))
            .force('two',isolate(d3.forceRadial(w*0.04, col3B, row1), function(d){ return d.LIHNeighbNum === 2; }))
            .force('three',isolate(d3.forceRadial(w*0.04, col5B, row1), function(d){ return d.LIHNeighbNum === 3; }))
            .force('four',isolate(d3.forceRadial(w*0.04, col1B, row2), function(d){ return d.LIHNeighbNum === 4; }))
            .force('five',isolate(d3.forceRadial(w*0.04, col3B, row2), function(d){ return d.LIHNeighbNum === 5; }))
            .force('six',isolate(d3.forceRadial(w*0.04, col5B, row2), function(d){ return d.LIHNeighbNum === 6; }))
            .force('seven',isolate(d3.forceRadial(w*0.04, col1B, row3), function(d){ return d.LIHNeighbNum === 7; }))
            .force('eight',isolate(d3.forceRadial(w*0.04, col3B, row3), function(d){ return d.LIHNeighbNum === 8; }))
            .force('nine',isolate(d3.forceRadial(w*0.04, col5B, row3), function(d){ return d.LIHNeighbNum === 9; }))
            .force('charge',chargeForce);
            simulation.alpha(1).restart().on('end',function(){ console.log('end'); });
        }
      });

    var schoolSimulationDC = function() {
      simulation
        .force('x-school',null)
        .force('y-school',null)
        .force('x-race',null)
        .force('y-race',null)
        .force('x-income',null)
        .force('y-income',null)
        .force('y-readiness',null)
        .force('collide',collideForce)
        .force('one',isolate(d3.forceRadial(w*0.04, col2B, row1), function(d){ return d.DCSchool === 'SchAB'; }))
        .force('two',isolate(d3.forceRadial(w*0.04, col4B, row1), function(d){ return d.DCSchool === 'SchA'; }))
        .force('three',isolate(d3.forceRadial(w*0.04, col6B, row1), function(d){ return d.DCSchool === 'SchBH'; }))
        .force('four',isolate(d3.forceRadial(w*0.04, col2B, row2), function(d){ return d.DCSchool === 'SchBB'; }))
        .force('five',isolate(d3.forceRadial(w*0.04, col4B, row2), function(d){ return d.DCSchool === 'SchB'; }))
        .force('six',isolate(d3.forceRadial(w*0.04, col6B, row2), function(d){ return d.DCSchool === 'SchC'; }))
        .force('seven',isolate(d3.forceRadial(w*0.04, col2B, row3), function(d){ return d.DCSchool === 'SchCW'; }))
        .force('eight',isolate(d3.forceRadial(w*0.04, col4B, row3), function(d){ return d.DCSchool === 'SchD'; }))
        .force('nine',isolate(d3.forceRadial(w*0.04, col6B, row3), function(d){ return d.DCSchool === 'SchDW'; }))
        .force('charter',isolate(d3.forceRadial(w*0.04, col7B, row1), function(d){ return d.DCSchool === 'Charter'; }))
        .force('private',isolate(d3.forceRadial(w*0.04, col7B, row2), function(d){ return d.DCSchool === 'Private'; }))
        .force('charge',chargeForce)
        .on('tick',function(){ nodes.transition().duration(50)
          // .delay(delay)
          .attr('transform',function(d){ return 'translate('+ d.x+','+ d.y+')' }); });
      simulation.alpha(1).restart().on('end',function(){ console.log('end'); });
    }

    var schoolSimulationSQ = function() {
      simulation
        .force('x-school',null)
        .force('y-school',null)
        .force('x-race',null)
        .force('y-race',null)
        .force('x-income',null)
        .force('y-income',null)
        .force('y-readiness',null)
        .force('collide',collideForce)
        .force('one',isolate(d3.forceRadial(w*0.04, col2B, row1), function(d){ return d.statusQuoSchool === 'SchAB'; }))
        .force('two',isolate(d3.forceRadial(w*0.04, col4B, row1), function(d){ return d.statusQuoSchool === 'SchA'; }))
        .force('three',isolate(d3.forceRadial(w*0.04, col6B, row1), function(d){ return d.statusQuoSchool === 'SchBH'; }))
        .force('four',isolate(d3.forceRadial(w*0.04, col2B, row2), function(d){ return d.statusQuoSchool === 'SchBB'; }))
        .force('five',isolate(d3.forceRadial(w*0.04, col4B, row2), function(d){ return d.statusQuoSchool === 'SchB'; }))
        .force('six',isolate(d3.forceRadial(w*0.04, col6B, row2), function(d){ return d.statusQuoSchool === 'SchC'; }))
        .force('seven',isolate(d3.forceRadial(w*0.04, col2B, row3), function(d){ return d.statusQuoSchool === 'SchCW'; }))
        .force('eight',isolate(d3.forceRadial(w*0.04, col4B, row3), function(d){ return d.statusQuoSchool === 'SchD'; }))
        .force('nine',isolate(d3.forceRadial(w*0.04, col6B, row3), function(d){ return d.statusQuoSchool === 'SchDW'; }))
        .force('charter',isolate(d3.forceRadial(w*0.04, col7B, row1), function(d){ return d.statusQuoSchool === 'Charter'; }))
        .force('private',isolate(d3.forceRadial(w*0.04, col7B, row2), function(d){ return d.statusQuoSchool === 'Private'; }))
        .force('charge',chargeForce)
        .on('tick',function(){ nodes.transition().duration(50)
          // .delay(delay)
          .attr('transform',function(d){ return 'translate('+ d.x+','+ d.y+')' }); });
      simulation.alpha(1).restart().on('end',function(){ console.log('end'); });
    }

    var schoolSimulationLIH = function() {
      simulation
        .force('x-school',null)
        .force('y-school',null)
        .force('x-race',null)
        .force('y-race',null)
        .force('x-income',null)
        .force('y-income',null)
        .force('y-readiness',null)
        .force('collide',collideForce)
        .force('one',isolate(d3.forceRadial(w*0.04, col2B, row1), function(d){ return d.LIHSchool === 'SchAB'; }))
        .force('two',isolate(d3.forceRadial(w*0.04, col4B, row1), function(d){ return d.LIHSchool === 'SchA'; }))
        .force('three',isolate(d3.forceRadial(w*0.04, col6B, row1), function(d){ return d.LIHSchool === 'SchBH'; }))
        .force('four',isolate(d3.forceRadial(w*0.04, col2B, row2), function(d){ return d.LIHSchool === 'SchBB'; }))
        .force('five',isolate(d3.forceRadial(w*0.04, col4B, row2), function(d){ return d.LIHSchool === 'SchB'; }))
        .force('six',isolate(d3.forceRadial(w*0.04, col6B, row2), function(d){ return d.LIHSchool === 'SchC'; }))
        .force('seven',isolate(d3.forceRadial(w*0.04, col2B, row3), function(d){ return d.LIHSchool === 'SchCW'; }))
        .force('eight',isolate(d3.forceRadial(w*0.04, col4B, row3), function(d){ return d.LIHSchool === 'SchD'; }))
        .force('nine',isolate(d3.forceRadial(w*0.04, col6B, row3), function(d){ return d.LIHSchool === 'SchDW'; }))
        .force('charter',isolate(d3.forceRadial(w*0.04, col7B, row1), function(d){ return d.LIHSchool === 'Charter'; }))
        .force('private',isolate(d3.forceRadial(w*0.04, col7B, row2), function(d){ return d.LIHSchool === 'Private'; }))
        .force('charge',chargeForce)
        .on('tick',function(){ nodes.transition().duration(50)
          // .delay(delay)
          .attr('transform',function(d){ return 'translate('+ d.x+','+ d.y+')' }); });
      simulation.alpha(1).restart().on('end',function(){ console.log('end'); });
    }

    var schoolSimulationDC_B = function() {
      simulation
        .force('x-school',null)
        .force('y-school',null)
        .force('x-race',null)
        .force('y-race',null)
        .force('x-income',null)
        .force('y-income',null)
        .force('y-readiness',null)
        .force('collide',collideForce)
        .force('one',isolate(d3.forceRadial(w*0.04, col1, row1), function(d){ return d.DCSchool === 'SchAB'; }))
        .force('two',isolate(d3.forceRadial(w*0.04, col2, row1), function(d){ return d.DCSchool === 'SchA'; }))
        .force('three',isolate(d3.forceRadial(w*0.04, col3, row1), function(d){ return d.DCSchool === 'SchBH'; }))
        .force('four',isolate(d3.forceRadial(w*0.04, col1, row2), function(d){ return d.DCSchool === 'SchBB'; }))
        .force('five',isolate(d3.forceRadial(w*0.04, col2, row2), function(d){ return d.DCSchool === 'SchB'; }))
        .force('six',isolate(d3.forceRadial(w*0.04, col3, row2), function(d){ return d.DCSchool === 'SchC'; }))
        .force('seven',isolate(d3.forceRadial(w*0.04, col1, row3), function(d){ return d.DCSchool === 'SchCW'; }))
        .force('eight',isolate(d3.forceRadial(w*0.04, col2, row3), function(d){ return d.DCSchool === 'SchD'; }))
        .force('nine',isolate(d3.forceRadial(w*0.04, col3, row3), function(d){ return d.DCSchool === 'SchDW'; }))
        .force('charter',isolate(d3.forceRadial(w*0.04, col4, row1), function(d){ return d.DCSchool === 'Charter'; }))
        .force('private',isolate(d3.forceRadial(w*0.04, col4, row2), function(d){ return d.DCSchool === 'Private'; }))
        .force('charge',chargeForce)
        .on('tick',function(){ nodes.attr('transform',function(d){ return 'translate('+ d.x+','+ d.y+')' }); });

      simulation.alpha(1).restart().on('end',function(){ console.log('end'); });
    }

    var schoolSimulationSQ_B = function() {
      simulation
        .force('x-school',null)
        .force('y-school',null)
        .force('x-race',null)
        .force('y-race',null)
        .force('x-income',null)
        .force('y-income',null)
        .force('y-readiness',null)
        .force('collide',collideForce)
        .force('one',isolate(d3.forceRadial(w*0.04, col1, row1), function(d){ return d.statusQuoSchool === 'SchAB'; }))
        .force('two',isolate(d3.forceRadial(w*0.04, col2, row1), function(d){ return d.statusQuoSchool === 'SchA'; }))
        .force('three',isolate(d3.forceRadial(w*0.04, col3, row1), function(d){ return d.statusQuoSchool === 'SchBH'; }))
        .force('four',isolate(d3.forceRadial(w*0.04, col1, row2), function(d){ return d.statusQuoSchool === 'SchBB'; }))
        .force('five',isolate(d3.forceRadial(w*0.04, col2, row2), function(d){ return d.statusQuoSchool === 'SchB'; }))
        .force('six',isolate(d3.forceRadial(w*0.04, col3, row2), function(d){ return d.statusQuoSchool === 'SchC'; }))
        .force('seven',isolate(d3.forceRadial(w*0.04, col1, row3), function(d){ return d.statusQuoSchool === 'SchCW'; }))
        .force('eight',isolate(d3.forceRadial(w*0.04, col2, row3), function(d){ return d.statusQuoSchool === 'SchD'; }))
        .force('nine',isolate(d3.forceRadial(w*0.04, col3, row3), function(d){ return d.statusQuoSchool === 'SchDW'; }))
        .force('charter',isolate(d3.forceRadial(w*0.04, col4, row1), function(d){ return d.statusQuoSchool === 'Charter'; }))
        .force('private',isolate(d3.forceRadial(w*0.04, col4, row2), function(d){ return d.statusQuoSchool === 'Private'; }))
        .force('charge',chargeForce)
        .on('tick',function(){ nodes.attr('transform',function(d){ return 'translate('+ d.x+','+ d.y+')' }); });

      simulation.alpha(1).restart().on('end',function(){ console.log('end'); });
    }

    var schoolSimulationLIH_B = function() {
      simulation
        .force('x-school',null)
        .force('y-school',null)
        .force('x-race',null)
        .force('y-race',null)
        .force('x-income',null)
        .force('y-income',null)
        .force('y-readiness',null)
        .force('collide',collideForce)
        .force('one',isolate(d3.forceRadial(w*0.04, col1, row1), function(d){ return d.LIHSchool === 'SchAB'; }))
        .force('two',isolate(d3.forceRadial(w*0.04, col2, row1), function(d){ return d.LIHSchool === 'SchA'; }))
        .force('three',isolate(d3.forceRadial(w*0.04, col3, row1), function(d){ return d.LIHSchool === 'SchBH'; }))
        .force('four',isolate(d3.forceRadial(w*0.04, col1, row2), function(d){ return d.LIHSchool === 'SchBB'; }))
        .force('five',isolate(d3.forceRadial(w*0.04, col2, row2), function(d){ return d.LIHSchool === 'SchB'; }))
        .force('six',isolate(d3.forceRadial(w*0.04, col3, row2), function(d){ return d.LIHSchool === 'SchC'; }))
        .force('seven',isolate(d3.forceRadial(w*0.04, col1, row3), function(d){ return d.LIHSchool === 'SchCW'; }))
        .force('eight',isolate(d3.forceRadial(w*0.04, col2, row3), function(d){ return d.LIHSchool === 'SchD'; }))
        .force('nine',isolate(d3.forceRadial(w*0.04, col3, row3), function(d){ return d.LIHSchool === 'SchDW'; }))
        .force('charter',isolate(d3.forceRadial(w*0.04, col4, row1), function(d){ return d.LIHSchool === 'Charter'; }))
        .force('private',isolate(d3.forceRadial(w*0.04, col4, row2), function(d){ return d.LIHSchool === 'Private'; }))
        .force('charge',chargeForce)
        .on('tick',function(){ nodes.attr('transform',function(d){ return 'translate('+ d.x+','+ d.y+')' }); });

      simulation.alpha(1).restart().on('end',function(){ console.log('end'); });
    }

    var schoolSimulationDCAll_B = function() {
      simulation
        .force('x-school',null)
        .force('y-school',null)
        .force('x-race',null)
        .force('y-race',null)
        .force('x-income',null)
        .force('y-income',null)
        .force('y-readiness',null)
        .force('collide',collideForce)
        .force('one',isolate(d3.forceRadial(w*0.04, col1, row1), function(d){ return d.DCSchoolAll === 'SchAB'; }))
        .force('two',isolate(d3.forceRadial(w*0.04, col2, row1), function(d){ return d.DCSchoolAll === 'SchA'; }))
        .force('three',isolate(d3.forceRadial(w*0.04, col3, row1), function(d){ return d.DCSchoolAll === 'SchBH'; }))
        .force('four',isolate(d3.forceRadial(w*0.04, col1, row2), function(d){ return d.DCSchoolAll === 'SchBB'; }))
        .force('five',isolate(d3.forceRadial(w*0.04, col2, row2), function(d){ return d.DCSchoolAll === 'SchB'; }))
        .force('six',isolate(d3.forceRadial(w*0.04, col3, row2), function(d){ return d.DCSchoolAll === 'SchC'; }))
        .force('seven',isolate(d3.forceRadial(w*0.04, col1, row3), function(d){ return d.DCSchoolAll === 'SchCW'; }))
        .force('eight',isolate(d3.forceRadial(w*0.04, col2, row3), function(d){ return d.DCSchoolAll === 'SchD'; }))
        .force('nine',isolate(d3.forceRadial(w*0.04, col3, row3), function(d){ return d.DCSchoolAll === 'SchDW'; }))
        .force('charter',isolate(d3.forceRadial(w*0.04, col4, row1), function(d){ return d.DCSchoolAll === 'Charter'; }))
        .force('private',isolate(d3.forceRadial(w*0.04, col4, row2), function(d){ return d.DCSchoolAll === 'Private'; }))
        .force('charge',chargeForce)
        .on('tick',function(){ nodes.attr('transform',function(d){ return 'translate('+ d.x+','+ d.y+')' }); });

      simulation.alpha(1).restart().on('end',function(){ console.log('end'); });
    }

    var schoolSimulationSQAll_B = function() {
      simulation
        .force('x-school',null)
        .force('y-school',null)
        .force('x-race',null)
        .force('y-race',null)
        .force('x-income',null)
        .force('y-income',null)
        .force('y-readiness',null)
        .force('collide',collideForce)
        .force('one',isolate(d3.forceRadial(w*0.04, col1, row1), function(d){ return d.statusQuoSchoolAll === 'SchAB'; }))
        .force('two',isolate(d3.forceRadial(w*0.04, col2, row1), function(d){ return d.statusQuoSchoolAll === 'SchA'; }))
        .force('three',isolate(d3.forceRadial(w*0.04, col3, row1), function(d){ return d.statusQuoSchoolAll === 'SchBH'; }))
        .force('four',isolate(d3.forceRadial(w*0.04, col1, row2), function(d){ return d.statusQuoSchoolAll === 'SchBB'; }))
        .force('five',isolate(d3.forceRadial(w*0.04, col2, row2), function(d){ return d.statusQuoSchoolAll === 'SchB'; }))
        .force('six',isolate(d3.forceRadial(w*0.04, col3, row2), function(d){ return d.statusQuoSchoolAll === 'SchC'; }))
        .force('seven',isolate(d3.forceRadial(w*0.04, col1, row3), function(d){ return d.statusQuoSchoolAll === 'SchCW'; }))
        .force('eight',isolate(d3.forceRadial(w*0.04, col2, row3), function(d){ return d.statusQuoSchoolAll === 'SchD'; }))
        .force('nine',isolate(d3.forceRadial(w*0.04, col3, row3), function(d){ return d.statusQuoSchoolAll === 'SchDW'; }))
        .force('charter',isolate(d3.forceRadial(w*0.04, col4, row1), function(d){ return d.statusQuoSchoolAll === 'Charter'; }))
        .force('private',isolate(d3.forceRadial(w*0.04, col4, row2), function(d){ return d.statusQuoSchoolAll === 'Private'; }))
        .force('charge',chargeForce)
        .on('tick',function(){ nodes.attr('transform',function(d){ return 'translate('+ d.x+','+ d.y+')' }); });

      simulation.alpha(1).restart().on('end',function(){ console.log('end'); });
    }

    var schoolSimulationLIHAll_B = function() {
      simulation
        .force('x-school',null)
        .force('y-school',null)
        .force('x-race',null)
        .force('y-race',null)
        .force('x-income',null)
        .force('y-income',null)
        .force('y-readiness',null)
        .force('collide',collideForce)
        .force('one',isolate(d3.forceRadial(w*0.04, col1, row1), function(d){ return d.LIHSchoolAll === 'SchAB'; }))
        .force('two',isolate(d3.forceRadial(w*0.04, col2, row1), function(d){ return d.LIHSchoolAll === 'SchA'; }))
        .force('three',isolate(d3.forceRadial(w*0.04, col3, row1), function(d){ return d.LIHSchoolAll === 'SchBH'; }))
        .force('four',isolate(d3.forceRadial(w*0.04, col1, row2), function(d){ return d.LIHSchoolAll === 'SchBB'; }))
        .force('five',isolate(d3.forceRadial(w*0.04, col2, row2), function(d){ return d.LIHSchoolAll === 'SchB'; }))
        .force('six',isolate(d3.forceRadial(w*0.04, col3, row2), function(d){ return d.LIHSchoolAll === 'SchC'; }))
        .force('seven',isolate(d3.forceRadial(w*0.04, col1, row3), function(d){ return d.LIHSchoolAll === 'SchCW'; }))
        .force('eight',isolate(d3.forceRadial(w*0.04, col2, row3), function(d){ return d.LIHSchoolAll === 'SchD'; }))
        .force('nine',isolate(d3.forceRadial(w*0.04, col3, row3), function(d){ return d.LIHSchoolAll === 'SchDW'; }))
        .force('charter',isolate(d3.forceRadial(w*0.04, col4, row1), function(d){ return d.LIHSchoolAll === 'Charter'; }))
        .force('private',isolate(d3.forceRadial(w*0.04, col4, row2), function(d){ return d.LIHSchoolAll === 'Private'; }))
        .force('charge',chargeForce)
        .on('tick',function(){ nodes.attr('transform',function(d){ return 'translate('+ d.x+','+ d.y+')' }); });

      simulation.alpha(1).restart().on('end',function(){ console.log('end'); });
    }

    var schoolSimulationSQBal_B = function() {
      simulation
        .force('x-school',null)
        .force('y-school',null)
        .force('x-race',null)
        .force('y-race',null)
        .force('x-income',null)
        .force('y-income',null)
        .force('y-readiness',null)
        .force('collide',collideForce)
        .force('one',isolate(d3.forceRadial(w*0.04, col1, row1), function(d){ return d.statusQuoBalanced === 'SchAB'; }))
        .force('two',isolate(d3.forceRadial(w*0.04, col2, row1), function(d){ return d.statusQuoBalanced === 'SchA'; }))
        .force('three',isolate(d3.forceRadial(w*0.04, col3, row1), function(d){ return d.statusQuoBalanced === 'SchBH'; }))
        .force('four',isolate(d3.forceRadial(w*0.04, col1, row2), function(d){ return d.statusQuoBalanced === 'SchBB'; }))
        .force('five',isolate(d3.forceRadial(w*0.04, col2, row2), function(d){ return d.statusQuoBalanced === 'SchB'; }))
        .force('six',isolate(d3.forceRadial(w*0.04, col3, row2), function(d){ return d.statusQuoBalanced === 'SchC'; }))
        .force('seven',isolate(d3.forceRadial(w*0.04, col1, row3), function(d){ return d.statusQuoBalanced === 'SchCW'; }))
        .force('eight',isolate(d3.forceRadial(w*0.04, col2, row3), function(d){ return d.statusQuoBalanced === 'SchD'; }))
        .force('nine',isolate(d3.forceRadial(w*0.04, col3, row3), function(d){ return d.statusQuoBalanced === 'SchDW'; }))
        .force('charter',isolate(d3.forceRadial(w*0.04, col4, row1), function(d){ return d.statusQuoBalanced === 'Charter'; }))
        .force('private',isolate(d3.forceRadial(w*0.04, col4, row2), function(d){ return d.statusQuoBalanced === 'Private'; }))
        .force('charge',chargeForce)
        .on('tick',function(){ nodes.attr('transform',function(d){ return 'translate('+ d.x+','+ d.y+')' }); });

      simulation.alpha(1).restart().on('end',function(){ console.log('end'); });
    }


    // School text
    var schoolTxt = textFull.append('div').attr('class','txt school-txt').style('margin-top',h*0.05+'px').style('display','none');
    schoolTxt.append('p').attr('class','page-title').text('ELEMENTARY SCHOOLS');
    schoolTxt.append('p').attr('class','prompt').text('Choose an elementary school for your child.');
    var schoolTxtC = textFull.append('div').attr('class','txt school-txt').style('margin-top',h*0.05+'px').style('display','none');
    var schoolTxtD = d3.select('#right-col').append('div').style('margin-top',h*0.05+'px').style('display','none');

    // Update the buttons and simulation on policy toggle
    d3.select('#SQ-assignment').on('click',function(d){

      if(chosenResPolicy == 'diverse'){
          console.log('diverse assignment');
          console.log(selected.schType);

          schoolSimulationDC_B();

          d3.selectAll('.seg-rect').transition().style('fill',function(d){ return scaleSegregation(d.segregation_DC); });
          d3.selectAll('.seg-text').transition().text(function(d){ return d3.format('.2')(d.segregation_DC); });
          d3.select('.profile-school-segregation').html(73);
          d3.select('.profile-academic').html(d3.format('.2')(selectedAcademic));
          d3.select('.profile-non-academic').html(d3.format('.2')(selectedNonAcademic));

        } else if (chosenResPolicy == 'status quo') {
          console.log('status quo assignment');
          console.log(selected.schType);

          schoolSimulationSQ_B();
          d3.selectAll('.seg-rect').transition().style('fill',function(d){ return scaleSegregation(d.segregation_SQ); });
          d3.selectAll('.seg-text').transition().text(function(d){ return d3.format('.2')(d.segregation_SQ); });
          d3.select('.profile-school-segregation').html(55);
          d3.select('.profile-academic').html(d3.format('.2')(selectedAcademic));
          d3.select('.profile-non-academic').html(d3.format('.2')(selectedNonAcademic));

        } else {
          console.log('low income housing assignment');
          console.log(selected.schType);

          schoolSimulationLIH_B();
          d3.selectAll('.seg-rect').transition().style('fill',function(d){ return scaleSegregation(d.segregation_LIH); });
          d3.selectAll('.seg-text').transition().text(function(d){ return d3.format('.2')(d.segregation_LIH); });
          d3.select('.profile-school-segregation').html(71);
          d3.select('.profile-academic').html(d3.format('.2')(selectedAcademic));
          d3.select('.profile-non-academic').html(d3.format('.2')(selectedNonAcademic));
        };

        d3.selectAll('.segregation-dot').remove();

        sidebar.append('circle').attr('cx',segregationScaleX(schoolSegregation)).attr('class','segregation-dot')
          .attr('cy',h*0.745).attr('r',5).style('fill',scaleSegregation(schoolSegregation))
          .style('stroke','#333333').style('stroke-width',1);

        sidebar.append('circle').attr('cx',segregationScaleX(selectedAcademic)).attr('class','segregation-dot')
          .attr('cy',h*0.835).attr('r',5).style('fill',scaleSegregation(selectedAcademic))
          .style('stroke','#333333').style('stroke-width',1);

        sidebar.append('circle').attr('cx',segregationScaleX(selectedNonAcademic)).attr('class','segregation-dot')
          .attr('cy',h*0.925).attr('r',5).style('fill',scaleSegregation(selectedNonAcademic))
          .style('stroke','#333333').style('stroke-width',1);

    });

    d3.select('#CC-Chicago').on('click',function(d){
      schoolSimulationSQBal_B();
      d3.selectAll('.seg-rect').transition().style('fill',function(d){ return scaleSegregation(d.segregation_SQBalanced); });
      d3.selectAll('.seg-text').transition().text(function(d){ return d3.format('.2')(d.segregation_SQBalanced); });
      d3.select('.profile-school-segregation').html(89);
      d3.select('.profile-academic').html(d3.format('.2')(selectedAcademic_Balanced));
      d3.select('.profile-non-academic').html(d3.format('.2')(selectedNonAcademic_Balanced));

      d3.selectAll('.segregation-dot').remove();

      sidebar.append('circle').attr('cx',segregationScaleX(89)).attr('class','segregation-dot')
        .attr('cy',h*0.745).attr('r',5).style('fill',scaleSegregation(89))
        .style('stroke','#333333').style('stroke-width',1);

      sidebar.append('circle').attr('cx',segregationScaleX(selectedAcademic_Balanced)).attr('class','segregation-dot')
        .attr('cy',h*0.835).attr('r',5).style('fill',scaleSegregation(selectedAcademic_Balanced))
        .style('stroke','#333333').style('stroke-width',1);

      sidebar.append('circle').attr('cx',segregationScaleX(selectedNonAcademic_Balanced)).attr('class','segregation-dot')
        .attr('cy',h*0.925).attr('r',5).style('fill',scaleSegregation(selectedNonAcademic_Balanced))
        .style('stroke','#333333').style('stroke-width',1);

    });

    d3.select('#full-attendance').on('click',function(d){
      if(chosenResPolicy == 'diverse'){ schoolSimulationDCAll_B();
      } else if (chosenResPolicy == 'status quo') { schoolSimulationSQAll_B();
      } else { schoolSimulationLIHAll_B(); };
    });

    var createSQSchoolBtns = function(){

      if(chosenResPolicy == 'diverse'){
        console.log('diverse assignment');
        // Draw the school buttons
        schls = mainSvg.selectAll('.school-group').data(schools)
          .enter().append('g').attr('class','school-group').attr('text-anchor','middle')
          .attr('transform',function(d){ return 'translate('+ (schoolScaleX(d.actual)) +','+ (schoolScaleY(d.actual)) +')'})
          .on('click',function(d){
            var option;
            if(selected.statusQuoNeighbNum == d.sqNum){ option = 'available'; }
              else if (selected.income >= 60000 & d.actual == 'Private' & selected.readiness == 1){ option = 'available'; }
                else if (selected.income >= 60000 & d.actual == 'Private' & selected.readiness == 2){ option = 'not available'; }
                  else if (selected.income < 60000 & d.actual == 'Private'){ option = 'not available'; }
                    else if (d.actual == 'Charter' & selected.readiness == 1){ option = 'available'; }
                      else if (d.actual == 'Charter' & selected.readiness == 2){ option = 'not available'; }
                        else if (addlOption1 == d.sqNum || addlOption2 == d.sqNum){ option = 'available'; }
                          else{ option = 'not available'; };

            if(option == 'available') {
              console.log(chosenResPolicy);
              schoolSegregation = 73;

              // draw();
              schls.on('click',null);
              selected.DCSchool = d.actual;
              selected.statusQuoBalanced = d.actual;
              selectedAcademic = d.score_DC;
              selectedNonAcademic = d.segregation_DC;
              selectedAcademic_Balanced = d.score_Balanced;
              selectedNonAcademic_Balanced = d.segregation_SQBalanced;
              selected.schType = d.schType;
              schoolTxt.style('display','none');
              schoolTxtC.style('display','block');
              schoolTxtC.append('p').attr('class','your').text('You chose a '+selected.schType+' school for your child');

              // Neighborhood sidebar text
              d3.select('.profile-school').html(selected.schType);
              d3.select('#school').style('opacity',1);
              d3.select('#school-segregation').style('opacity',1);
              d3.select('#academic-score').style('opacity',1);
              d3.select('#non-academic-score').style('opacity',1);
              d3.select('#change-school').style('visibility','visible');
              d3.select('.profile-school-segregation').html(schoolSegregation);
              d3.select('.profile-academic').html(d3.format('.2')(selectedAcademic));
              d3.select('.profile-non-academic').html(d3.format('.2')(selectedNonAcademic));
              schoolBtn.style('display','block');

              schoolSimulationDC();

              schls.append('circle').attr('class','seg-rect').attr('cx',-(w*0.01)).attr('cy',-(w*0.005)).attr('r',18)
                  .style('stroke-width',2).style('stroke','#202020')
                  .style('fill',function(d){ return scaleSegregation(d.segregation_DC); });
              schls.append('text').text(function(d){ return d3.format('.2')(d.segregation_DC); })
                  .attr('y',-(w*0.0035)).attr('x',-(w*0.009)).attr('class','graph-label seg-text').style('fill','#ffffff');

              sidebar.append('rect')
                .attr('x',segregationScaleX(0)).attr('y',h*0.745).attr('width',90).attr('height',1)
                .style('fill','url(#linear-gradient)');
              sidebar.append('circle').attr('cx',segregationScaleX(schoolSegregation)).attr('class','segregation-dot')
                .attr('cy',h*0.745).attr('r',5).style('fill',scaleSegregation(schoolSegregation))
                .style('stroke','#333333').style('stroke-width',1);

              sidebar.append('rect')
                .attr('x',segregationScaleX(0)).attr('y',h*0.835).attr('width',90).attr('height',1)
                .style('fill','url(#linear-gradient)');
              sidebar.append('circle').attr('cx',segregationScaleX(selectedAcademic)).attr('class','segregation-dot').attr('class','segregation-dot')
                .attr('cy',h*0.835).attr('r',5).style('fill',scaleSegregation(selectedAcademic))
                .style('stroke','#333333').style('stroke-width',1);

              sidebar.append('rect')
                .attr('x',segregationScaleX(0)).attr('y',h*0.925).attr('width',90).attr('height',1)
                .style('fill','url(#linear-gradient)');
              sidebar.append('circle').attr('cx',segregationScaleX(selectedNonAcademic)).attr('class','segregation-dot')
                .attr('cy',h*0.925).attr('r',5).style('fill',scaleSegregation(selectedNonAcademic))
                .style('stroke','#333333').style('stroke-width',1);

            }

            })
            .on('mouseenter',function(d){
              var tooltiptext = function(d){ if(selected.statusQuoNeighbNum == d.sqNum){ return "Public School: Your Assigned School"; }
                else if (selected.income >= 60000 & d.actual == 'Private' & selected.readiness == 1){ return "Private School: Affordable!"; }
                  else if (selected.income >= 60000 & d.actual == 'Private' & selected.readiness == 2){ return "Private School: Your Child Didn't Pass the Admissions Test"; }
                    else if (selected.income < 60000 & d.actual == 'Private'){ return "Private School: Not Affordable"; }
                      else if (d.actual == 'Charter' & selected.readiness == 1){ return 'Charter School: Your Child Passed the Admissions Test!'; }
                        else if (d.actual == 'Charter' & selected.readiness == 2){ return 'Charter School: Your Child Didn\'t Pass the Admissions Test'; }
                          else if (addlOption1 == d.sqNum || addlOption2 == d.sqNum){ return 'Public School: Available for Transfer'; }
                            else{ return 'Public School: Not Available'; }
                };
                var tooltiptextfour = function(d){ return d.sqNeighbDescrC; };
                var tooltiptextfive = function(d){ return d.sqNeighbDescrD; };
                tooltip.transition().style('visibility','visible');
                if(d3.select(this).style('opacity') == 1) { d3.select(this).style('cursor','pointer') };
                tooltip.transition().style('visibility','visible');
                // tooltip.style('left',schoolScaleX(d.actual)-120+'px').style('top',schoolScaleY(d.actual)-160+'px');
                tooltip.select('.tooltip-title').html(tooltiptext(d));
                tooltip.select('.tooltip-two').html(tooltiptextfour(d));
                tooltip.select('.tooltip-three').html(tooltiptextfive(d));
                tooltip.select('.tooltip-four').html("");
            })
            .on('mousemove',function(d){
                var xy = d3.mouse(mainSvg.node());
                tooltip.style('left',xy[0]-110+'px').style('top',xy[1]+20+'px');
            })
            .on('mouseleave',function(d){
                tooltip.transition().style('visibility','hidden');
            });

          schls.append('svg:image').attr('xlink:href',function(d){
            if(d.schType == 'Public'){ return './data/public.png'; }
              else if (d.schType == 'Private'){ return './data/private.png'; }
                else { return './data/charter.png'; }
            })
            .attr('height',h*0.055).attr('width',h*0.055)
            .attr('x',-(h*0.04)).attr('y',-(h*0.04))
            .style('fill','000000')
            .style('opacity',function(d){
              if(selected.statusQuoNeighbNum == d.sqNum){ return 1; }
                else if (selected.income >= 60000 & d.actual == 'Private' & selected.readiness == 1){ return 1; }
                  else if (selected.income >= 60000 & d.actual == 'Private' & selected.readiness == 2){ return 0.2; }
                    else if (selected.income < 60000 & d.actual == 'Private'){ return 0.2; }
                      else if (d.actual == 'Charter' & selected.readiness == 1){ 1; }
                        else if (d.actual == 'Charter' & selected.readiness == 2){ return 0.2; }
                          else if (addlOption1 == d.sqNum || addlOption2 == d.sqNum){ return 1; }
                            else{ return 0.2; }
              });

      } else if (chosenResPolicy == 'status quo') {

        console.log('status quo assignment');
        // Draw the school buttons
        schls = mainSvg.selectAll('.school-group').data(schools)
          .enter().append('g').attr('class','school-group').attr('text-anchor','middle')
          .attr('transform',function(d){ return 'translate('+ (schoolScaleX(d.actual)) +','+ (schoolScaleY(d.actual)) +')'})
          .on('click',function(d){
            var option;

            if(selected.statusQuoNeighbNum == d.sqNum){ option = 'available'; }
              else if (selected.income >= 60000 & d.actual == 'Private' & selected.readiness == 1){ option = 'available'; }
                else if (selected.income >= 60000 & d.actual == 'Private' & selected.readiness == 2){ option = 'not available'; }
                  else if (selected.income < 60000 & d.actual == 'Private'){ option = 'not available'; }
                    else if (d.actual == 'Charter' & selected.readiness == 1){ option = 'available'; }
                      else if (d.actual == 'Charter' & selected.readiness == 2){ option = 'not available'; }
                        else if (addlOption1 == d.sqNum || addlOption2 == d.sqNum){ option = 'available'; }
                          else{ option = 'not available'; };

            if(option == 'available') {
              console.log(chosenResPolicy);
              schoolSegregation = 55;

              // draw();
              schls.on('click',null);
              selected.statusQuoSchool = d.actual;
              selected.statusQuoBalanced = d.actual;
              selected.schType = d.schType;
              selectedAcademic = d.score_SQ;
              selectedNonAcademic = d.segregation_SQ;
              selectedAcademic_Balanced = d.score_Balanced;
              selectedNonAcademic_Balanced = d.segregation_SQBalanced;
              schoolTxt.style('display','none');
              schoolTxtC.style('display','block');
              schoolTxtC.append('p').attr('class','your').text('You chose a '+selected.schType+' school for your child');

              // Neighborhood sidebar text
              d3.select('.profile-school').html(selected.schType);
              d3.select('#change-school').style('visibility','visible');
              d3.select('.profile-school-segregation').html(schoolSegregation);
              d3.select('.profile-academic').html(d3.format('.2')(selectedAcademic));
              d3.select('.profile-non-academic').html(d3.format('.2')(selectedNonAcademic));
              d3.select('#school').style('opacity',1);
              d3.select('#school-segregation').style('opacity',1);
              d3.select('#academic-score').style('opacity',1);
              d3.select('#non-academic-score').style('opacity',1);
              schoolBtn.style('display','block');

              schoolSimulationSQ();

              schls.append('circle').attr('class','seg-rect').attr('cx',-(w*0.01)).attr('cy',-(w*0.005)).attr('r',18)
                  .style('stroke-width',2).style('stroke','#202020')
                  .style('fill',function(d){ return scaleSegregation(d.segregation_SQ); });
              schls.append('text').text(function(d){ return d3.format('.2')(d.segregation_SQ); })
                  .attr('y',-(w*0.0035)).attr('x',-(w*0.009)).attr('class','graph-label seg-text').style('fill','#ffffff');

              sidebar.append('rect')
                .attr('x',segregationScaleX(0)).attr('y',h*0.745).attr('width',90).attr('height',1)
                .style('fill','url(#linear-gradient)');
              sidebar.append('circle').attr('cx',segregationScaleX(schoolSegregation)).attr('class','segregation-dot')
                .attr('cy',h*0.745).attr('r',5).style('fill',scaleSegregation(schoolSegregation))
                .style('stroke','#333333').style('stroke-width',1);

              sidebar.append('rect')
                .attr('x',segregationScaleX(0)).attr('y',h*0.835).attr('width',90).attr('height',1)
                .style('fill','url(#linear-gradient)');
              sidebar.append('circle').attr('cx',segregationScaleX(selectedAcademic)).attr('class','segregation-dot')
                .attr('cy',h*0.835).attr('r',5).style('fill',scaleSegregation(selectedAcademic))
                .style('stroke','#333333').style('stroke-width',1);

              sidebar.append('rect')
                .attr('x',segregationScaleX(0)).attr('y',h*0.925).attr('width',90).attr('height',1)
                .style('fill','url(#linear-gradient)');
              sidebar.append('circle').attr('cx',segregationScaleX(selectedNonAcademic)).attr('class','segregation-dot')
                .attr('cy',h*0.925).attr('r',5).style('fill',scaleSegregation(selectedNonAcademic))
                .style('stroke','#333333').style('stroke-width',1);
            }

            })
            .on('mouseenter',function(d){
              var tooltiptext = function(d){ if(selected.statusQuoNeighbNum == d.sqNum){ return "Public School: Your Assigned School"; }
                else if (selected.income >= 60000 & d.actual == 'Private' & selected.readiness == 1){ return "Private School: Affordable!"; }
                  else if (selected.income >= 60000 & d.actual == 'Private' & selected.readiness == 2){ return "Private School: Your Child Didn't Pass the Admissions Test"; }
                    else if (selected.income < 60000 & d.actual == 'Private'){ return "Private School: Not Affordable"; }
                      else if (d.actual == 'Charter' & selected.readiness == 1){ return 'Charter School: Your Child Passed the Admissions Test!'; }
                        else if (d.actual == 'Charter' & selected.readiness == 2){ return 'Charter School: Your Child Didn\'t Pass the Admissions Test'; }
                          else if (addlOption1 == d.sqNum || addlOption2 == d.sqNum){ return 'Public School: Available for Transfer'; }
                            else{ return 'Public School: Not Available'; }
              };
              var tooltiptextfour = function(d){ return d.sqNeighbDescrC; };
              var tooltiptextfive = function(d){ return d.sqNeighbDescrD; };
              tooltip.transition().style('visibility','visible');
                if(d3.select(this).style('opacity') == 1) { d3.select(this).style('cursor','pointer') };
                tooltip.transition().style('visibility','visible');
                // tooltip.style('left',schoolScaleX(d.actual)-120+'px').style('top',schoolScaleY(d.actual)-160+'px');
                tooltip.select('.tooltip-title').html(tooltiptext(d));
                tooltip.select('.tooltip-two').html(tooltiptextfour(d));
                tooltip.select('.tooltip-three').html(tooltiptextfive(d));
                tooltip.select('.tooltip-four').html("");
            })
            .on('mousemove',function(d){
                var xy = d3.mouse(mainSvg.node());
                tooltip.style('left',xy[0]-110+'px').style('top',xy[1]+20+'px');
            })
            .on('mouseleave',function(d){
                tooltip.transition().style('visibility','hidden');
            });

            schls.append('svg:image').attr('xlink:href',function(d){
              if(d.schType == 'Public'){ return './data/public.png'; }
                else if (d.schType == 'Private'){ return './data/private.png'; }
                  else { return './data/charter.png'; }
              })
              .attr('height',h*0.055).attr('width',h*0.055)
              .attr('x',-(h*0.04)).attr('y',-(h*0.04))
            .style('opacity',function(d){
              if(selected.statusQuoNeighbNum == d.sqNum){ return 1; }
                else if (selected.income >= 60000 & d.actual == 'Private' & selected.readiness == 1){ return 1; }
                  else if (selected.income >= 60000 & d.actual == 'Private' & selected.readiness == 2){ return 0.2; }
                    else if (selected.income < 60000 & d.actual == 'Private'){ return 0.2; }
                      else if (d.actual == 'Charter' & selected.readiness == 1){ 1; }
                        else if (d.actual == 'Charter' & selected.readiness == 2){ return 0.2; }
                          else if (addlOption1 == d.sqNum || addlOption2 == d.sqNum){ return 1; }
                            else{ return 0.2; }
              });

      } else {
        console.log('low income housing assignment');
        // Draw the school buttons
        schls = mainSvg.selectAll('.school-group').data(schools)
          .enter().append('g').attr('class','school-group').attr('text-anchor','middle')
          .attr('transform',function(d){ return 'translate('+ (schoolScaleX(d.actual)) +','+ (schoolScaleY(d.actual)) +')'})
          .on('click',function(d){
            var option;

            if(selected.statusQuoNeighbNum == d.sqNum){ option = 'available'; }
              else if (selected.income >= 60000 & d.actual == 'Private' & selected.readiness == 1){ option = 'available'; }
                else if (selected.income >= 60000 & d.actual == 'Private' & selected.readiness == 2){ option = 'not available'; }
                  else if (selected.income < 60000 & d.actual == 'Private'){ option = 'not available'; }
                    else if (d.actual == 'Charter' & selected.readiness == 1){ option = 'available'; }
                      else if (d.actual == 'Charter' & selected.readiness == 2){ option = 'not available'; }
                        else if (addlOption1 == d.sqNum || addlOption2 == d.sqNum){ option = 'available'; }
                          else{ option = 'not available'; };

            if(option == 'available') {

              console.log(chosenResPolicy);
              schoolSegregation = 71;

              // draw();
              schls.on('click',null);

              selected.LIHSchool = d.actual;
              selected.statusQuoBalanced = d.actual;
              selected.schType = d.schType;
              selectedAcademic = d.score_LIH;
              selectedNonAcademic = d.segregation_LIH;
              selectedAcademic_Balanced = d.score_Balanced;
              selectedNonAcademic_Balanced = d.segregation_SQBalanced;
              schoolTxt.style('display','none');
              schoolTxtC.style('display','block');
              schoolTxtC.append('p').attr('class','your').text('You chose a '+selected.schType+' school for your child');

              // Neighborhood sidebar text
              d3.select('.profile-school').html(selected.schType);
              d3.select('#change-school').style('visibility','visible');
              d3.select('.profile-school-segregation').html(schoolSegregation);
              d3.select('.profile-academic').html(d3.format('.2')(selectedAcademic));
              d3.select('.profile-non-academic').html(d3.format('.2')(selectedNonAcademic));
              d3.select('#school').style('opacity',1);
              d3.select('#school-segregation').style('opacity',1);
              d3.select('#academic-score').style('opacity',1);
              d3.select('#non-academic-score').style('opacity',1);
              schoolBtn.style('display','block');

              schoolSimulationLIH();

              schls.append('circle').attr('class','seg-rect').attr('cx',-(w*0.01)).attr('cy',-(w*0.005)).attr('r',18)
                  .style('stroke-width',2).style('stroke','#202020')
                  .style('fill',function(d){ return scaleSegregation(d.segregation_LIH); });
              schls.append('text').text(function(d){ return d3.format('.2')(d.segregation_LIH); })
                  .attr('y',-(w*0.0035)).attr('x',-(w*0.009)).attr('class','graph-label seg-text').style('fill','#ffffff');

              sidebar.append('rect')
                .attr('x',segregationScaleX(0)).attr('y',h*0.745).attr('width',90).attr('height',1)
                .style('fill','url(#linear-gradient)');
              sidebar.append('circle').attr('cx',segregationScaleX(schoolSegregation)).attr('class','segregation-dot')
                .attr('cy',h*0.745).attr('r',5).style('fill',scaleSegregation(schoolSegregation))
                .style('stroke','#333333').style('stroke-width',1);

              sidebar.append('rect')
                .attr('x',segregationScaleX(0)).attr('y',h*0.835).attr('width',90).attr('height',1)
                .style('fill','url(#linear-gradient)');
              sidebar.append('circle').attr('cx',segregationScaleX(selectedAcademic)).attr('class','segregation-dot')
                .attr('cy',h*0.835).attr('r',5).style('fill',scaleSegregation(selectedAcademic))
                .style('stroke','#333333').style('stroke-width',1);

              sidebar.append('rect')
                .attr('x',segregationScaleX(0)).attr('y',h*0.925).attr('width',90).attr('height',1)
                .style('fill','url(#linear-gradient)');
              sidebar.append('circle').attr('cx',segregationScaleX(selectedNonAcademic)).attr('class','segregation-dot')
                .attr('cy',h*0.925).attr('r',5).style('fill',scaleSegregation(selectedNonAcademic))
                .style('stroke','#333333').style('stroke-width',1);
              }

            })
            .on('mouseenter',function(d){
              var tooltiptext = function(d){ if(selected.statusQuoNeighbNum == d.sqNum){ return "Public School: Your Assigned School"; }
                else if (selected.income >= 60000 & d.actual == 'Private' & selected.readiness == 1){ return "Private School: Affordable!"; }
                  else if (selected.income >= 60000 & d.actual == 'Private' & selected.readiness == 2){ return "Private School: Your Child Didn't Pass the Admissions Test"; }
                    else if (selected.income < 60000 & d.actual == 'Private'){ return "Private School: Not Affordable"; }
                      else if (d.actual == 'Charter' & selected.readiness == 1){ return 'Charter School: Your Child Passed the Admissions Test!'; }
                        else if (d.actual == 'Charter' & selected.readiness == 2){ return 'Charter School: Your Child Didn\'t Pass the Admissions Test'; }
                          else if (addlOption1 == d.sqNum || addlOption2 == d.sqNum){ return 'Public School: Available for Transfer'; }
                            else{ return 'Public School: Not Available'; }
                };
                var tooltiptextfour = function(d){ return d.sqNeighbDescrC; };
                var tooltiptextfive = function(d){ return d.sqNeighbDescrD; };
                tooltip.transition().style('visibility','visible');
                if(d3.select(this).style('opacity') == 1) { d3.select(this).style('cursor','pointer') };
                tooltip.transition().style('visibility','visible');
                // tooltip.style('left',schoolScaleX(d.actual)-120+'px').style('top',schoolScaleY(d.actual)-160+'px');
                tooltip.select('.tooltip-title').html(tooltiptext(d));
                tooltip.select('.tooltip-two').html(tooltiptextfour(d));
                tooltip.select('.tooltip-three').html(tooltiptextfive(d));
                tooltip.select('.tooltip-four').html("");

            })
            .on('mousemove',function(d){
                var xy = d3.mouse(mainSvg.node());
                tooltip.style('left',xy[0]-110+'px').style('top',xy[1]+20+'px');
            })
            .on('mouseleave',function(d){
                tooltip.transition().style('visibility','hidden');
            });

            schls.append('svg:image').attr('xlink:href',function(d){
              if(d.schType == 'Public'){ return './data/public.png'; }
                else if (d.schType == 'Private'){ return './data/private.png'; }
                  else { return './data/charter.png'; }
              })
              .attr('height',h*0.055).attr('width',h*0.055)
              .attr('x',-(h*0.04)).attr('y',-(h*0.04))
            .style('opacity',function(d){
              if(selected.statusQuoNeighbNum == d.sqNum){ return 1; }
                else if (selected.income >= 60000 & d.actual == 'Private' & selected.readiness == 1){ return 1; }
                  else if (selected.income >= 60000 & d.actual == 'Private' & selected.readiness == 2){ return 0.2; }
                    else if (selected.income < 60000 & d.actual == 'Private'){ return 0.2; }
                      else if (d.actual == 'Charter' & selected.readiness == 1){ 1; }
                        else if (d.actual == 'Charter' & selected.readiness == 2){ return 0.2; }
                          else if (addlOption1 == d.sqNum || addlOption2 == d.sqNum){ return 1; }
                            else{ return 0.2; }
              });
      };
    }

    var schoolBtn = d3.select('#continue-school');
    schoolBtn.on('click',function(){

      context.clearRect(0, 0, w, h); // Clear the canvas.
      d3.selectAll('.nbhd-group').remove(); // Remove houses
      schoolPolicyButtons.style('display','inline-block').style('left',w*0.68+'px');
      schoolTxtD.style('display','inline-block');
      schoolTxtD.append('p').attr('class','body-left').style('margin-top',h*0.052+'px').html('This school\'s average test score is '+d3.format('.2')(selectedAcademic)+' and its non-academic score is '+d3.format('.2')(selectedNonAcademic)+'. Non-academic scores reflect diversity, showing how well the school make-up matches the city. The non-academic score for each school is shown below.');
      schoolTxtD.append('p').attr('class','body-left').html('See what would happen with a city-wide controlled choice policy without neighborhood zones and where the make-up of each school reflects the socioeconomic make-up of the city.');
      finalBtn.style('display','inline-block');
      schoolBtn.style('display','none');
      d3.selectAll('.school-group').transition().attr('transform',function(d){ return 'translate('+ (schoolScaleX_B(d.actual)) +','+ (schoolScaleY(d.actual)) +')'})
      d3.selectAll('.nbhd-group').on('click',null);

      if(chosenResPolicy == 'diverse'){ schoolSimulationDC_B();
      } else if (chosenResPolicy == 'status quo') { schoolSimulationSQ_B();
      } else { schoolSimulationLIH_B(); };

    })

    // Final button
    var finalBtn = d3.select('#continue-final');
    finalBtn.on('click',function(){ location.reload(true); });

  }

  return exports;

}
