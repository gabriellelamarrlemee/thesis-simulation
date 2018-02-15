//Set up a drawing environment
var m = {t:50,r:50,b:50,l:50};
var w = document.getElementById('canvas1').clientWidth,
    h = 1500;
// var w = outerWidth - m.l - m.r,
//     h = outerHeight - m.t - m.b;


var plot1 = d3.select('#canvas1')
    .append('svg')
    .attr('width',w)
    .attr('height',h)
		.append('g');


//Scale
var scaleColor = d3.scaleOrdinal()
    .domain(['White','Black','Hispanic'])
    .range(['blue','purple','green']);
var raceScaleX = d3.scaleOrdinal()
		.domain(['White','Black','Hispanic'])
		.range([w/4,w/2,(w/4)*3]);
var incomeScaleX = d3.scaleLinear()
		.domain([0,150000])
		.range([50,w-50]);
var zoneScaleX = d3.scaleOrdinal()
		.domain(['A','B','C'])
		.range([w/6*3,w/6*4,w/6*5]);


//Mapping specific functions
//First, choose a projection
var projection = d3.geoAlbersUsa();

var pathGenerator = d3.geoPath()
    .projection(projection);

//The data for the first set of lines
var lineData_01 = [ {'x':w/2, 'y':h/12}, {'x':w/2, 'y':h/6}, {'x':w/5, 'y':h/6}, {'x':w/5, 'y':h/4} ];
var lineData_02 = [ {'x':w/2, 'y':h/12}, {'x':w/2, 'y':h/4} ];
var lineData_03 = [ {'x':w/2, 'y':h/12}, {'x':w/2, 'y':h/6}, {'x':(w/5)*4, 'y':h/6}, {'x':(w/5)*4, 'y':h/4} ];

//This is the accessor function
var lineFunction = d3.line()
	.x(function(d) { return d.x; })
	.y(function(d) { return d.y; });

//Drawing the line
var line_01 = plot1.append('path').datum(lineData_01).attr('d', lineFunction).attr('class','line');
var line_02 = plot1.append('path').datum(lineData_02).attr('d', lineFunction).attr('class','line');
var line_03 = plot1.append('path').datum(lineData_03).attr('d', lineFunction).attr('class','line');

d3.selectAll('.line')
	// .attr('stroke', 'gray')
	// .attr('stroke-width', .25)
	.attr('fill', 'none');




//import data
d3.queue()
	.defer(d3.csv,'./data/WorkingChildData.csv',parseData)
	.defer(d3.json,'./data/cps_attendance_zones.json')
	// .defer(d3.json,'./data/gz_2010_us_050_00_5m.json')
	.await(dataLoaded);

function dataLoaded(err, data, mapData){

	//Update projection to fit all the data within the drawing extent
	projection
			.fitExtent([[0,0],[w/4,h]],mapData);

	//Create the circles

	var nodes = plot1.selectAll('.node')
		.data(data)
		.enter()
		.append('g')
    .on('mouseenter',function(d){ d3.select(this).selectAll('circle').attr('r',6); })
		.on('mouseleave',function(d){ d3.select(this).selectAll('circle').attr('r',4); })
		.on('click',function(d){
			d3.selectAll('circle')
				.style('fill',function(d){return scaleColor(d.race)})
				.style('opacity',.15);
			d3.select(this).selectAll('circle').style('opacity',1);
			selectionRace = d.race;
      selectedDot = d3.select(this);
      // Add the description
        plot1.append('g').attr('transform','translate('+0+','+((h/4)+50)+')').append('text').text('Your child is '+ selectionRace +'.');

        //Add the delay and then the race transition - as the transition is going, make the race nodes appear
        transition_white(whiteSelection);
    		transition_black(blackSelection);
    		transition_hispanic(hispanicSelection);

        // transition_white_income(incomeWhiteSelection);
        // transition_white_income(incomeWhiteSelection);
        // transition_white_income(incomeWhiteSelection);


        //Add content about the racial demographics of the city
        plot1.append('g').attr('transform','translate('+0+','+((h/4)+250)+')').append('text').text("Let's see the make-up of the entire Chicago school-age population.");
        plot1.append('g').attr('transform','translate('+0+','+((h/4)+260)+')').append('text').text("XX% is White");
        plot1.append('g').attr('transform','translate('+0+','+((h/4)+260)+')').append('text').text("XX% is Black");
        plot1.append('g').attr('transform','translate('+0+','+((h/4)+260)+')').append('text').text("XX% is Hispanic");

		});

  nodes.append('circle')
    .attr('transform',function(d){ return 'translate('+d.x+','+d.y+')'; })
    .attr('class',function(d){return 'original ' + 'node ' + d.race;})
    .attr('r',4).style('visibility','visible');
	nodes.append('circle')
    .attr('transform',function(d){ return 'translate('+d.x+','+d.y+')'; })
    .attr('class',function(d){return 'race ' + 'node ' + d.race;})
    .attr('r',4).style('visibility','hidden');
  nodes.append('circle')
    .attr('transform',function(d){ return 'translate('+d.x+','+d.y+')'; })
    .attr('class',function(d){return 'income ' + 'node ' + d.race;})
    .attr('r',4).style('visibility','hidden');
  nodes.append('circle')
    .attr('transform',function(d){ return 'translate('+d.x+','+d.y+')'; })
    .attr('class',function(d){return 'zone ' + 'node ' + d.race;})
    .attr('r',4).style('visibility','hidden');
  nodes.append('circle')
    .attr('transform',function(d){ return 'translate('+d.x+','+d.y+')'; })
    .attr('class',function(d){return 'school ' + 'node ' + d.race;})
    .attr('r',4).style('visibility','hidden');


  // var raceNodes = plot1.selectAll('.race')
	// 	.data(data)
	// 	.enter()
	// 	.append('g').attr('class',function(d){return 'race ' + 'node ' + d.race;})
	// 	.attr('transform',function(d){ return 'translate('+d.x+','+d.y+')'; })
  //   .style('visibility','hidden');
  //
  // raceNodes.append('circle').attr('r',4);
  //
  // var incomeNodes = plot1.selectAll('.income')
	// 	.data(data)
	// 	.enter()
	// 	.append('g').attr('class',function(d){return 'income ' + 'node ' + d.race;})
	// 	.attr('transform',function(d){ return 'translate('+d.x+','+d.y+')'; })
  //   .style('visibility','hidden');
  //
  // incomeNodes.append('circle').attr('r',4);
  //
  // var zoneNodes = plot1.selectAll('.zone')
  //   .data(data)
  //   .enter()
  //   .append('g').attr('class',function(d){return 'zone ' + 'node ' + d.race;})
  //   .attr('transform',function(d){ return 'translate('+d.x+','+d.y+')'; })
  //   .style('visibility','hidden');
  //
  // zoneNodes.append('circle').attr('r',4);
  //
  // var educationNodes = plot1.selectAll('.education')
  //   .data(data)
  //   .enter()
  //   .append('g').attr('class',function(d){return 'education ' + 'node ' + d.race;})
  //   .attr('transform',function(d){ return 'translate('+d.x+','+d.y+')'; })
  //   .style('visibility','visible');
  //
  // educationNodes.append('circle').attr('r',4)
  //   .on('mouseenter',function(d){ d3.select(this).attr('r',6); })
  //   .on('mouseleave',function(d){ d3.select(this).attr('r',4); })
  //   .on('click',function(d){
  //     d3.selectAll('circle')
  //       .style('fill',function(d){return scaleColor(d.race)})
  //       .style('opacity',.25);
  //     d3.select(this).style('opacity',1);
  //     selectionRace = d.race;
  //   //Add the description
    //   plot1.append('g').attr('transform','translate('+0+','+((h/4)+250)+')').append('text')
    //     .text('Your child is '+ selectionRace +'.');
    //
    //   //Add the delay and then the race transition - as the transition is going, make the race nodes appear
    //   transition_white(whiteSelection);
  	// 	transition_black(blackSelection);
  	// 	transition_hispanic(hispanicSelection);
    //
    //   //Add content about the racial demographics of the city
    //   //'Text goes here about percentages of white, black, and hispanic school-age children in Chicago. This could include pie charts comparing total residents to school-age children. Define these categories. Could also discuss how these populations have changed over time.');
    //
    // });


	var line,
			whiteX = (w/5)-54,
			blackX = (w/2)-54,
			hispanicX = ((w/5)*4)-54,
			raceY = h/4,
			rowY,
			columns = 10,
			buffer = 12,
			colpos = 0,
			selectionRace,
      selectedDot;

	var raceSelection = d3.selectAll('.race'),
      incomeSelection = d3.selectAll('.income'),
      zoneSelection = d3.selectAll('.zone'),
      schoolSelection = d3.selectAll('.school'),
      whiteSelection = d3.selectAll('.race.White'),
			blackSelection = d3.selectAll('.race.Black'),
			hispanicSelection = d3.selectAll('.race.Hispanic')
      incomeWhiteSelection = d3.selectAll('.income.White'),
      incomeBlackSelection = d3.selectAll('.income.Black'),
      incomeHispanicSelection = d3.selectAll('.income.Hispanic'),
      circleSelection = d3.selectAll('circle');



	//Make the dot follow the lines
	function translateAlong(line, offset){
		      var l = line.getTotalLength();
		      return function(d, i , a){
		        return function(t){
		          var p = line.getPointAtLength(t * l);
		          return "translate(" + p.x + "," + p.y + ")";
		        }
		      }
		    }

	//Race Transition - White
  function transition_white(){

    whiteSelection.each(function(pathItem, index){

			calculateRow(index);

      raceSelection.style('visibility','visible');

			function calculateRow(){
				if(index < columns){ rowY = 0; colpos = index; }
					else if(index < columns*2){ rowY = buffer; colpos = index-10;  }
						else if(index < columns*3){ rowY = buffer*2; colpos = index-20;  }
							else if(index < columns*4){ rowY = buffer*3; colpos = index-30;  }
								else if(index < columns*5){ rowY = buffer*4; colpos = index-40;  }
									else if(index < columns*6){ rowY = buffer*5; colpos = index-50;  }
										else if(index < columns*7){ rowY = buffer*6; colpos = index-60;  }
											else if(index < columns*8){ rowY = buffer*7; colpos = index-70;  }
												else if(index < columns*9){ rowY = buffer*8; colpos = index-80;  }
													else if(index < columns*10){ rowY = buffer*9; colpos = index-90;  }
														else if(index < columns*11){ rowY = buffer*10; colpos = index-100;  }
															else if(index < columns*12){ rowY = buffer*11; colpos = index-110;  }
																else if(index < columns*13){ rowY = buffer*12; colpos = index-120;  }
																	else if(index < columns*14){ rowY = buffer*13; colpos = index-130;  }
																		else if(index < columns*15){ rowY = buffer*14; colpos = index-140;  }
																			else if(index < columns*16){ rowY = buffer*15; colpos = index-150;  }
						else { rowY = buffer*16; colpos = index-160;  };
			}

      d3.select(this)
	      .transition()
	      .delay(index * 15)
	      .duration(index * 10 + 2000)
	      .attrTween("transform", translateAlong(line_01.node(), index))
				.transition()
				.attr('transform',function(d){
					return 'translate('+ (whiteX + (colpos * 12)) +','+ (raceY + rowY) +')' });

			});

	}


  //Income Transition - White (Move dots to same location as race dots.)
  function transition_white_income(){

    incomeWhiteSelection.each(function(pathItem, index){
      // console.log(this);

      calculateRow(index);

      incomeSelection.style('visibility','visible');


      function calculateRow(){
        if(index < columns){ rowY = 0; colpos = index; }
          else if(index < columns*2){ rowY = buffer; colpos = index-10;  }
            else if(index < columns*3){ rowY = buffer*2; colpos = index-20;  }
              else if(index < columns*4){ rowY = buffer*3; colpos = index-30;  }
                else if(index < columns*5){ rowY = buffer*4; colpos = index-40;  }
                  else if(index < columns*6){ rowY = buffer*5; colpos = index-50;  }
                    else if(index < columns*7){ rowY = buffer*6; colpos = index-60;  }
                      else if(index < columns*8){ rowY = buffer*7; colpos = index-70;  }
                        else if(index < columns*9){ rowY = buffer*8; colpos = index-80;  }
                          else if(index < columns*10){ rowY = buffer*9; colpos = index-90;  }
                            else if(index < columns*11){ rowY = buffer*10; colpos = index-100;  }
                              else if(index < columns*12){ rowY = buffer*11; colpos = index-110;  }
                                else if(index < columns*13){ rowY = buffer*12; colpos = index-120;  }
                                  else if(index < columns*14){ rowY = buffer*13; colpos = index-130;  }
                                    else if(index < columns*15){ rowY = buffer*14; colpos = index-140;  }
                                      else if(index < columns*16){ rowY = buffer*15; colpos = index-150;  }
            else { rowY = buffer*16; colpos = index-160;  };
      }

      d3.select(this)
        .attr('transform',function(d){
          return 'translate('+ (whiteX + (colpos * 12)) +','+ (raceY + rowY) +')' });

      // console.log(this);

      });

  }


	//Race Transition - Black
	function transition_black(){

		blackSelection.each(function(pathItem, index){

			calculateRow(index);

			function calculateRow(){
				if(index < columns){ rowY = 0; colpos = index; }
					else if(index < columns*2){ rowY = buffer; colpos = index-10;  }
						else if(index < columns*3){ rowY = buffer*2; colpos = index-20;  }
							else if(index < columns*4){ rowY = buffer*3; colpos = index-30;  }
								else if(index < columns*5){ rowY = buffer*4; colpos = index-40;  }
									else if(index < columns*6){ rowY = buffer*5; colpos = index-50;  }
										else if(index < columns*7){ rowY = buffer*6; colpos = index-60;  }
											else if(index < columns*8){ rowY = buffer*7; colpos = index-70;  }
												else if(index < columns*9){ rowY = buffer*8; colpos = index-80;  }
													else if(index < columns*10){ rowY = buffer*9; colpos = index-90;  }
														else if(index < columns*11){ rowY = buffer*10; colpos = index-100;  }
															else if(index < columns*12){ rowY = buffer*11; colpos = index-110;  }
																else if(index < columns*13){ rowY = buffer*12; colpos = index-120;  }
																	else if(index < columns*14){ rowY = buffer*13; colpos = index-130;  }
																		else if(index < columns*15){ rowY = buffer*14; colpos = index-140;  }
																			else if(index < columns*16){ rowY = buffer*15; colpos = index-150;  }
						else { rowY = buffer*16; colpos = index-160;  };
			}

			d3.select(this)
				.transition()
				.delay(index * 15)
				.duration(index * 10 + 2000)
				.attrTween("transform", translateAlong(line_02.node(), index))
				.transition()
				.attr('transform',function(d){
					return 'translate('+ (blackX + (colpos * 12)) +','+ (raceY + rowY) +')' })
			});

	}

	//Race Transition - Hispanic
	function transition_hispanic(){

		hispanicSelection.each(function(pathItem, index){

			calculateRow(index);

			function calculateRow(){
				if(index < columns){ rowY = 0; colpos = index; }
					else if(index < columns*2){ rowY = buffer; colpos = index-10;  }
						else if(index < columns*3){ rowY = buffer*2; colpos = index-20;  }
							else if(index < columns*4){ rowY = buffer*3; colpos = index-30;  }
								else if(index < columns*5){ rowY = buffer*4; colpos = index-40;  }
									else if(index < columns*6){ rowY = buffer*5; colpos = index-50;  }
										else if(index < columns*7){ rowY = buffer*6; colpos = index-60;  }
											else if(index < columns*8){ rowY = buffer*7; colpos = index-70;  }
												else if(index < columns*9){ rowY = buffer*8; colpos = index-80;  }
													else if(index < columns*10){ rowY = buffer*9; colpos = index-90;  }
														else if(index < columns*11){ rowY = buffer*10; colpos = index-100;  }
															else if(index < columns*12){ rowY = buffer*11; colpos = index-110;  }
																else if(index < columns*13){ rowY = buffer*12; colpos = index-120;  }
																	else if(index < columns*14){ rowY = buffer*13; colpos = index-130;  }
																		else if(index < columns*15){ rowY = buffer*14; colpos = index-140;  }
																			else if(index < columns*16){ rowY = buffer*15; colpos = index-150;  }
						else { rowY = buffer*16; colpos = index-160;  };
			}

			d3.select(this)
				.transition()
				.delay(index * 15)
				.duration(index * 10 + 2000)
				.attrTween("transform", translateAlong(line_03.node(), index))
				.transition()
				.attr('transform',function(d){
					return 'translate('+ (hispanicX + (colpos * 12)) +','+ (raceY + rowY) +')' })
			});

	}



	//Set up force simulation
	var chargeForce = d3.forceManyBody().strength(-2),
			introForceY = d3.forceY().y(h/12).strength(.04),
			forceX = d3.forceX().x(w/2).strength(.02),
			raceForceX = d3.forceX().x(function(d){return raceScaleX(d.race)}),
			incomeForceX = d3.forceX().x(function(d){return incomeScaleX(d.income)}).strength(.1),
			incomeForceY = d3.forceY().y(h/2).strength(.06),
			zoneForceX = d3.forceX().x(function(d){return zoneScaleX(d.zone)}).strength(.1),
			zoneForceY = d3.forceY().y((h/8)*7),
			collide = d3.forceCollide().radius(6),
			smallcollide = d3.forceCollide().radius(3);


	//Intro simulation
	var simulation = d3.forceSimulation()
		 .force('charge',chargeForce)
		 .force('positionX',forceX)
		 .force('positionY',introForceY)
		 .force('collide',collide);
	simulation
		 .nodes(data)
		 .on('tick',function(){
		   // nodes.selectAll('circles').attr('transform',function(d){ return 'translate('+d.x+','+d.y+')';});
       circleSelection.attr('transform',function(d){ return 'translate('+d.x+','+d.y+')';}); })
		 .on('end',function(){ console.log('end'); });

   var simulation2 = d3.forceSimulation()
 		.force('incomeY',incomeForceY)
 		.force('incomeX',incomeForceX)
     .force('collide',collide);
     simulation2
   		 .nodes(data)
   		 .on('tick',function(){
          incomeSelection.attr('transform',function(d){ return 'translate('+d.x+','+d.y+')';}); })
   		 .on('end',function(){ console.log('end'); });
     simulation2.stop();

	//INCOME
	plot1.append('rect')
    .attr('class','button')
    .attr('x',w/2)
    .attr('y',h/2)
    .attr('width',30)
    .attr('height',20)
    .on('click',function(d){

    incomeSelection.style('visibility','visible');
    simulation2.restart();

    //Add axis
		plot1.append('g').attr('transform','translate('+50+','+((h/2)+50)+')').call(income_xAxis);
    //Add content about the racial demographics of the city
    plot1.append('g').attr('transform','translate('+0+','+((h/2)+150)+')').append('text').text('Your household income is $'+ selectedDot.income+'.');
    plot1.append('g').attr('transform','translate('+0+','+((h/2)+175)+')').append('text').text("Your child's education readiness is "+ selectedDot.education+".");

	});

  //INCOME
  plot1.append('rect')
    .attr('class','button')
    .attr('x',w/2)
    .attr('y',h/2+200)
    .attr('width',30)
    .attr('height',20)
    .on('click',function(d){

    incomeSelection.transition().attr('r',function(d){ return 4 * d.education });
    simulation2.alpha(1).restart();

    //Add content about education readiness
    plot1.append('g').attr('transform','translate('+0+','+((h/2)+250)+')').append('text').text('Children in higher income households are typically more ready to learn. [Explain this more.]');
    plot1.append('g').attr('transform','translate('+0+','+((h/2)+275)+')').append('text').text("Your child's education readiness is "+ selectedDot.education+".");

  });

	//STEP 3 button, the circles arrange by zone
	d3.select('#step3').on('click',function(d){

		d3.selectAll('.circles').attr('r',2);

		//Represent a feature collection of polygons
		var zones = plot1.selectAll('.zone')
				.data(mapData.features)
				.enter()
				.append('path').attr('class','zone')
				.attr('d',pathGenerator)
				.style('fill','black');

		simulation.force('incomeX',null)
							.force('collide',null)
							.force('smcollide',smallcollide)
							.force('zoneY',zoneForceY)
							.force('zoneX',zoneForceX);
		simulation.alpha(1).restart();

		plot1.append('svg:image').attr('xlink:href','./data/school_public_1095872.svg')
				 .attr('width',40).attr('height',40);

	});

	//Draw axis
	var income_xAxis = d3.axisBottom().scale(incomeScaleX);

}


function parseData(d){
	return {
		object_id:d.Object_ID,
		race:d.Race,
		income:d.Income,
    education:d.Education,
    zone:d.Zone,
		x:w*Math.random(),
		y:h*Math.random(),
	}
}
