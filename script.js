
var w = document.body.clientWidth,
    h = window.innerHeight;

// Number of directions for intro dots
var m = 5;
var map;


d3.queue()
	.defer(d3.csv,'./data/WorkingChildData.csv',parseChildren)
  .defer(d3.csv,'./data/WorkingNeighborhoodData.csv',parseNeighborhoods)
  .defer(d3.csv,'./data/population.csv',parsePopulation)
  .defer(d3.csv,'./data/zone_data.csv')
	.await(dataLoaded);

function dataLoaded(err, children, neighborhoods, population, mapData){

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

          // Stop looking through the json
          break;
        }
      }
    }

    map = json;
    console.log(map);

    var mainSvg = d3.select('#main');
    var detailPopSvg = d3.select('#detail-pop');
    var detailResSvg = d3.select('#detail-res');
    var detailSchoolSvg = d3.select('#detail-school');
    // var detailFinalSvg = d3.select('#detail-final');
    var data = [children,neighborhoods,population,map];

    var main = Main();
    var detailPop = DetailPop();
    var detailRes = DetailRes();
    var detailSchool = DetailSchool();
    // var detailFinal = DetailFinal();


    mainSvg.datum(data).call(main);
    detailPopSvg.datum(population).call(detailPop);
    detailResSvg.datum(map).call(detailRes);
    detailSchoolSvg.datum(data).call(detailSchool);

  })

}


function parseChildren(d){
	return {
		race: d.Race,
    incomeLevel: +d.IncomeLevel,
		income: +d.Income,
    readiness: +d.SchoolReadiness,
    statusQuoNeighb: d.StatusQuo_Neighborhood,
    statusQuoNeighbNum: +d.SQ_Num,
    statusQuoSchoolAll: d.FullAttend_SQ_School,
    statusQuoSchool: d.StatusQuo_School,
    LIHNeighb: d.LIH_Neighborhood,
    LIHNeighbNum: +d.LI_Num,
    LIHSchoolAll: d.FullAttend_LIH_School,
    LIHSchool: d.LIH_School,
    DCNeighb: d.DiverseChoice_Neighborhood,
    DCNeighbNum: +d.DC_Num,
    DCSchoolAll: d.FullAttendDiverseChoice_School,
    DCSchool: d.DiverseChoice_School,
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
    sqMathNSA: +d.AvgNSAMath3_8_StatusQuo
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
