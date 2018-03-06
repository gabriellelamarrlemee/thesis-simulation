
var w = document.body.clientWidth,
    h = window.innerHeight;

// Number of directions for intro dots
var m = 5;


d3.queue()
	.defer(d3.csv,'./data/WorkingChildData.csv',parseChildren)
  .defer(d3.csv,'./data/WorkingNeighborhoodData.csv',parseNeighborhoods)
	.defer(d3.json,'./data/cps_attendance_zones.json')
	.await(dataLoaded);

function dataLoaded(err, children, neighborhoods){

  var mainSvg = d3.select('#main');
  var data = [children,neighborhoods]

  var main = Main();
  // var profile = Profile();
  // var results = Results();
  // var detail = Detail();

  mainSvg.datum(data).call(main);
  // sidebarSvg.datum(data).call(profile);
  // sidebarSvg.datum(data).call(results);
  // detailSvg.datum(data).call(detail);

  // ***ADD CODE FOR A REFRESH BUTTON HERE - ON CLICK, CALL MAIN AGAIN

}


function parseChildren(d){
	return {
		race: d.Race,
    incomeLevel: +d.IncomeLevel,
		income: +d.Income,
    education: d.EducationPts,
    statusQuoNeighb: d.StatusQuo_Neighborhood,
    statusQuoNeighbNum: d.Num,
    statusQuoSchool: d.StatusQuo_School,
    LIHNeighb: d.LIH_Neighborhood,
    x: w * Math.random(),
		y: h * Math.random(),
    vx: Math.random() * 2 - 1,
    vy: Math.random() * 2 - 1,
    path: d3.range(m).map(function() { return [w * Math.random(), h * Math.random()]; }),
    count: 0
	}
}

function parseNeighborhoods(d){
	return {
		neighborhood: d.Neighborhood,
    alias: d.Alias,
    sqNum: +d.Num,
    actual: d.SchActual,
    letter: d.SchLetter,
    schType: d.SchType,
    count: +d.Count,
		sqNeighbDescr: d.Description_StatusQuo,
    sqBlackRes: +d.BlackResidentPct_StatusQuo,
    sqHispanicRes: +d.HispanicResidentPct_StatusQuo,
    sqWhiteRes: +d.WhiteResidentPct_StatusQuo,
    sqIncome: +d.AvgIncome_StatusQuo,
    sqSQRP: +d.AvgSQRP_StatusQuo,
    sqAccountability: +d.AvgAccountability_StatusQuo,
    sqReadingNWEA: +d.AvgNWEAReading_StatusQuo,
    sqMathNWEA: +d.AvgNWEAMath_StatusQuo,
    sqReadingNSA: +d.AvgNSAReading3_8_StatusQuo,
    sqMathNSA: +d.AvgNSAMath3_8_StatusQuo,

	}
}
