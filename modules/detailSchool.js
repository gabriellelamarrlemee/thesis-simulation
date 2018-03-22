console.log('detailSchool');

function DetailSchool(){

  // Scales


  var exports = function(selection){

    var closeButton = d3.select('#close-school');

    closeButton.on('click',function(){
      d3.select('#detail-school').style('visibility','hidden');
    });


  }

  return exports;


}
