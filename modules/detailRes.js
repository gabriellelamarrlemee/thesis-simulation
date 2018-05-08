console.log('detailRes');

function DetailRes(){

  // Scales
  var scaleColorWhite = d3.scaleLinear().domain([0,1]).range(['#202020','#00ccff']);
  var scaleColorBlack = d3.scaleLinear().domain([0,1]).range(['#202020','#cc00ff']);
  var scaleColorHispanic = d3.scaleLinear().domain([0,1]).range(['#202020','#66ff33']);
  // var scaleColorIncome = d3.scaleLinear().domain([0,200000]).range(['#202020','#E8E8E8']);
  var scaleColorIncome = d3.scaleLinear().domain([0,200000]).range([0,1]);
  // Mapping
  var projection = d3.geoAlbersUsa(),
      projectionPath = d3.geoPath().projection(projection);

  var exports = function(selection){

    var map = selection.datum();
    var w = w || selection.node().clientWidth,
        h = h || selection.node().clientHeight;

    var residentialSvg = selection.append('svg').style('position','fixed')
      .attr('width',w).attr('height',h).attr('class','residentialSvg');

    console.log(map);

    // Map projection
    projection.fitExtent([[w*0.6,h*0.15],[w*0.9,h*0.85]],map);

    var zones = residentialSvg.selectAll('.zone-res')
      .data(map.features)
      .enter().append('path')
      .attr('class',function(d){ return 'zone-res zone'+d.properties.value; })
      .attr('d',projectionPath)
      .style('fill',function(d){
        if(d.properties.black >= 0.7) {
          return '#cc00ff';
        } else if(d.properties.hispanic >= 0.7) {
          return '#66ff33';
        } else if(d.properties.white >= 0.7) {
          return '#00ccff';
        } else {
          return '#202020';
        }
      });

    d3.select('#detail-res').select('.row').style('position','fixed').style('margin-top',h/10+'px');
    d3.select('#seventy-map').on('click',function(){
      zones.style('fill',function(d){
        if(d.properties.black >= 0.7) {
          return '#cc00ff';
        } else if(d.properties.hispanic >= 0.7) {
          return '#66ff33';
        } else if(d.properties.white >= 0.7) {
          return '#00ccff';
        } else {
          return '#202020';
        }
      });
    });
    d3.select('#white-map').on('click',function(){
      zones.style('fill',function(d){ return scaleColorWhite(d.properties.white); });
    });
    d3.select('#black-map').on('click',function(){
      zones.style('fill',function(d){ return scaleColorBlack(d.properties.black); });
    });
    d3.select('#hispanic-map').on('click',function(){
      zones.style('fill',function(d){ return scaleColorHispanic(d.properties.hispanic); });
    });
    d3.select('#income-map').on('click',function(){
      zones.style('fill','#E8E8E8');
      zones.style('opacity',function(d){ return scaleColorIncome(d.properties.income); });
    });

    // Residential text
    var residentialTxt = d3.select('#full-detail-res').append('div').attr('class','txt').style('margin-top',h/10+'px');
    residentialTxt.append('p').attr('class','page-title-left').text('Residential Segregation');
    residentialTxt.append('p').attr('class','body-left').text('Chicago is a very segregated city. It is in the top 10 across the country in segregation between blacks and whites and Hispanics and whites.');
    residentialTxt.append('p').attr('class','body-left').text('Black families were confined to certain neighborhoods through zoning laws and redlining which prevented them from moving to other areas. White families today avoid black and Hispanic neighborhoods. It is not uncommon to find Chicago neighborhoods that are over 99% black.');
    residentialTxt.append('p').attr('class','body-left').text('The map to the right shows neighborhooods that are over 70% white, black, or Hispanic. Social scientists use the 70% threshold to determine whether an area is racially isolated.');


    var closeButton = d3.select('#close-res');

    closeButton.on('click',function(){
      d3.select('#detail-res').style('visibility','hidden');
    });

  }

  return exports;


}
