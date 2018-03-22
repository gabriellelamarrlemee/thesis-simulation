console.log('detailFinal');

function DetailFinal(){

  // Scales


  var exports = function(selection){

    console.log(selection.datum());

    // Population text
    var finalTxt = d3.select('#full-detail-final').append('div').attr('class','txt education-txt').style('margin-top',h/10+'px').attr('position','fixed');
    finalTxt.append('p').attr('class','body').text('Final Summary');
    finalTxt.append('p').attr('class','body').text('Add stats on educational improvement in academic and non academic things. The academic score is based on diversity of school for low income students (stays the same for medium to high income). The non academic score is based on diversity of school for all. Add a note to say try playing with other characters to see how you can affect the game.');
    // finalTxt.append('p').attr('class','body').text('While the black population has remained relatively stable, whites have left the city in large numnbers as the Hispanic population increased.');


    var refreshBtn = d3.select('#try-again');

    refreshBtn.on('click',function(){
      console.log('reload');
      location.reload(true); });



  }

  return exports;


}
