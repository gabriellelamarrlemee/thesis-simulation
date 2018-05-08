
var w = document.body.clientWidth,
    h = window.innerHeight;

// Number of directions for intro dots
var m = 5;


d3.queue()
	.defer(d3.csv,'./data/WorkingChildData.csv',parseChildren)
  .defer(d3.csv,'./data/WorkingNeighborhoodData.csv',parseNeighborhoods)
  .defer(d3.csv,'./data/population.csv',parsePopulation)
  .defer(d3.csv,'./data/zone_data.csv')
	.await(dataLoaded);

function dataLoaded(err, children, neighborhoods, population){

    var mainSvg = d3.select('#main');
    var detailPopSvg = d3.select('#detail-pop');
    var detailResSvg = d3.select('#detail-res');
    var detailSchoolSvg = d3.select('#detail-school');
    // var detailFinalSvg = d3.select('#detail-final');
    var data = [children,neighborhoods,population];

    var main = Main();
    var detailPop = DetailPop();
    var detailRes = DetailRes();
    var detailSchool = DetailSchool();
    // var detailFinal = DetailFinal();


    mainSvg.datum(data).call(main);
    detailPopSvg.datum(population).call(detailPop);
    // detailResSvg.datum(map).call(detailRes);
    detailSchoolSvg.datum(data).call(detailSchool);

}


function parseChildren(d){
	return {
    num: d.RandOrder,
		race: d.Race,
    incomeLevel: +d.IncomeLevel,
		income: +d.Income,
    readiness: +d.SchoolReadiness,
    statusQuoNeighb: d.StatusQuo_Neighborhood,
    statusQuoNeighbNum: +d.SQ_Num,
    statusQuoSchoolAll: d.FullAttend_SQ_School,
    statusQuoBalanced: d.Balanced_SQ_School,
    statusQuoSchool: d.StatusQuo_School,
    LIHNeighb: d.LIH_Neighborhood,
    LIHNeighbNum: +d.LI_Num,
    LIHSchoolAll: d.FullAttend_LIH_School,
    LIHSchool: d.LIH_School,
    DCNeighb: d.DiverseChoice_Neighborhood,
    DCNeighbNum: +d.DC_Num,
    DCSchoolAll: d.FullAttendDiverseChoice_School,
    DCSchool: d.DiverseChoice_School,
    radius: 3,
    x: w * Math.random(),
		y: h * Math.random(),
    vx: Math.random() * 2 - 1,
    vy: Math.random() * 2 - 1,
    path: d3.range(m).map(function() { return [w * Math.random(), h * Math.random()]; }),
    count: 0,
    dx: Math.random() - 0.5,
    dy: Math.random() - 0.5
	}
}

function parseNeighborhoods(d){
	return {
		neighborhood: d.Neighborhood,
    alias: d.Alias,
    sqNum: +d.Num,
    actual: d.SchActual,
    schType: d.SchType,
    count: +d.Count,
		sqNeighbDescrA: d.Description_StatusQuoA,
    sqNeighbDescrB: d.Description_StatusQuoB,
    sqNeighbDescrC: d.Description_StatusQuoC,
    sqNeighbDescrD: d.Description_StatusQuoD,
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
    avgTestScore: +d.AvgTestScore,
    segregation_SQ: +d.SQ_Segregation,
    segregation_SQBalanced: +d.SQ_Balanced_Segregation,
    segregation_LIH: +d.LIH_Segregation,
    segregation_DC: +d.DC_Segregation,
    score_SQ: +d.SQ_Score,
    score_LIH: +d.LIH_Score,
    score_DC: +d.DC_Score,
    score_Balanced: +d.Balanced_Score,
    blackSchPct_SQ: +d.SQBlackSchoolPct,
    hispanicSchPct_SQ: +d.SQHispanicSchoolPct,
    whiteSchPct_SQ: +d.SQWhiteSchoolPct,
    blackSchPctFull_SQ: +d.SQFullBlackSchoolPct,
    hispanicSchPctFull_SQ: +d.SQFullHispanicSchoolPct,
    whiteSchPctFull_SQ: +d.SQFullWhiteSchoolPct,
    blackSchPctBalanced_SQ: +d.SQBalancedBlackSchoolPct,
    hispanicSchPctBalanced_SQ: +d.SQBalancedHispanicSchoolPct,
    whiteSchPctBalanced_SQ: +d.SQBalancedWhiteSchoolPct,
    blackSchPct_LIH: +d.LIHBlackSchoolPct,
    hispanicSchPct_LIH: +d.LIHHispanicSchoolPct,
    whiteSchPct_LIH: +d.LIHWhiteSchoolPct,
    blackSchPctFull_LIH: +d.LIHFullBlackSchoolPct,
    hispanicSchPctFull_LIH: +d.LIHFullHispanicSchoolPct,
    whiteSchPctFull_LIH: +d.LIHFullWhiteSchoolPct,
    blackSchPct_DC: +d.DCBlackSchoolPct,
    hispanicSchPct_DC: +d.DCHispanicSchoolPct,
    whiteSchPct_DC: +d.DCWhiteSchoolPct,
    blackSchPctFull_DC: +d.DCFullBlackSchoolPct,
    hispanicSchPctFull_DC: +d.DCFullHispanicSchoolPct,
    whiteSchPctFull_DC: +d.DCFullWhiteSchoolPct
	}
}

function parsePopulation(d){
	return {
		year: d.Year,
    race: d.Race,
    total: +d.Total,
    totalpct: +d.TotalPct,
    child: +d.Child,
    childpct: +d.ChildPct,
    x: w * Math.random(),
    y: h * Math.random()
	}
}
