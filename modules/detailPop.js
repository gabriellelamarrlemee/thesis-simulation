console.log('detailPop');

function DetailPop(){

  // Scales
  var scaleColor = d3.scaleOrdinal().domain(['White','Black','Hispanic']).range(['blue','purple','green']);
  var ScaleX = d3.scaleOrdinal().domain(['1970','1980','1990','2000','2016'])
    .range([w/6,(w/6)*2,(w/6)*3,(w/6)*4,(w/6)*5]);

  var exports = function(selection){

    var population = selection.datum();

    var populationNested = d3.nest().key(function(d){ return d.year; }).entries(population);

    console.log(populationNested);

    var w = w || selection.node().clientWidth,
        h = h || selection.node().clientHeight * 0.66;

    var populationSvg = selection.append('svg')
      .attr('width',w).attr('height',h).attr('class','populationSvg')
      .style('color','blue');

    var closeButton = d3.select('#close-pop');

    closeButton.on('click',function(){
      d3.select('#detail-pop').style('visibility','hidden');
      d3.select('#learn-more-race').transition().style('display','block');
      d3.select('#sidebar').style('visibility','visible');
      d3.select('#continue-income').style('visibility','visible');
    });

    // Population text
    var populationTxt = d3.select('#full-detail-pop').append('div').attr('class','txt education-txt').style('margin-top',h/10+'px').attr('position','fixed');
    populationTxt.append('p').attr('class','body').text('Demographic Change');
    populationTxt.append('p').attr('class','body').text('The demographics of Chicago have changed dramatically over the past 48 years.');
    populationTxt.append('p').attr('class','body').text('While the black population has remained relatively stable, whites have left the city in large numnbers as the Hispanic population increased.');


    var drawPopulationHistory = function(){
      var multScale = 0.000025;

      // Draw the svg circles
      var popNodes = populationSvg.selectAll('.pop-node').data(population)
        .enter().append('g')
        .attr('class','pop-node')
        .attr('transform',function(d){ return 'translate('+ d.x +','+ d.y +')' });

      popNodes.append('circle')
        .attr('class','total')
        .attr('r',function(d){ return d.total * multScale; })
        .style('fill',function(d){ return scaleColor(d.race); })
        .style('opacity',0.2);

      popNodes.append('circle')
        .attr('class','child')
        .attr('r',function(d){ return d.child * multScale; })
        .style('fill',function(d){ return scaleColor(d.race); })
        .style('opacity',0.6);

      popNodes.on('click',function(d){
        console.log(d.year);
        console.log(ScaleX(d.year));
      });

      // Add labels for each year
      var popLabels = populationSvg.selectAll('.pop-labels').data(populationNested)
        .enter().append('g').attr('class','pop-labels').style('text-align','center')
        .attr('transform',function(d){ return 'translate('+ ScaleX(d.key) +','+ h*0.7 +')' });

      popLabels.append('text').text(function(d){ return d.key; }).attr('class','body')
        .attr('x',0).attr('y',0).style('text-anchor','middle');
      popLabels.append('text').text(function(d){
          return d.values[0].race + ': ' + d3.format('.0%')(d.values[0].totalpct) + ' of total  ' + d3.format('.0%')(d.values[0].childpct) + ' of children';
        }).attr('class','label').attr('x',0).attr('y','1.5em').style('text-anchor','middle');
      popLabels.append('text').text(function(d){
          return d.values[1].race + ': ' + d3.format('.0%')(d.values[1].totalpct) + ' of total  ' + d3.format('.0%')(d.values[1].childpct) + ' of children';
        }).attr('class','label').attr('x',0).attr('y','3em').style('text-anchor','middle');
      popLabels.append('text').text(function(d){
          return d.values[2].race + ': ' + d3.format('.0%')(d.values[2].totalpct) + ' of total  ' + d3.format('.0%')(d.values[2].childpct) + ' of children';
        }).attr('class','label').attr('x',0).attr('y','4.5em').style('text-anchor','middle');


      // Set up simulation
      var collideForce = d3.forceCollide().radius(function(d){ return (d.total * multScale); }),
          YForce = d3.forceY().y(h/2),
          XForce = d3.forceX().x(function(d){ return ScaleX(d.year); });

      // Base simulation
      var simulation = d3.forceSimulation()
        .force('collide',collideForce)
        .force('x',XForce)
        .force('y',YForce);

      simulation
        .nodes(population)
        .on('tick',function(){
          popNodes.attr('transform',function(d){ return 'translate('+ d.x +','+ d.y +')' });
        });

        // popSimulation.stop();

    }

    drawPopulationHistory();



  }

  return exports;


}
