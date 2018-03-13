console.log('detailRes');

function DetailRes(){

  // Scales


  var exports = function(selection){

    var closeButton = d3.select('#close-res');

    closeButton.on('click',function(){
      d3.select('#detail-res').style('visibility','hidden');
      d3.select('#learn-more-residence').transition().style('display','block');
    });

  }

  return exports;


}
