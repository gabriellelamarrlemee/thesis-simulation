
<?php

// Only process the form if $_POST isn't empty
if ( ! empty( $_POST ) ) {

	// Connect to MySQL
	$mysqli = new mysqli( 'localhost','schoomx2_admin', 'drA2EPha', 'schoomx2_schools' );

	// Check our connection
	// if ( $mysqli->connect_error ) {
	// 	die( 'Connect Error: ' . $mysqli->connect_errno . ': ' . $mysqli->connect_error );
	// }

	// Insert our data
	$sql = "INSERT INTO test3 ( input_1_1,
															input_1_2,
															input_1_3,
															input_2_1,
															input_2_2,
															input_2_3,
															input_2_4,
															input_3_1,
															input_3_2,
															input_4,
															input_5,
															input_6,
															input_7,
															input_8,
															input_9,
															input_10,
															input_1_1B,
															input_1_2B,
															input_1_3B,
															input_2_1B,
															input_2_2B,
															input_2_3B,
															input_2_4B,
															input_3_1B,
															input_3_2B,
															input_4B,
															input_5B,
															input_6B,
															input_7B,
															input_8B,
															input_9B
															 )
					VALUES ( '{$mysqli->real_escape_string($_POST['input_1_1'])}',
									 '{$mysqli->real_escape_string($_POST['input_1_2'])}',
									 '{$mysqli->real_escape_string($_POST['input_1_3'])}',
									 '{$mysqli->real_escape_string($_POST['input_2_1'])}',
									 '{$mysqli->real_escape_string($_POST['input_2_2'])}',
									 '{$mysqli->real_escape_string($_POST['input_2_3'])}',
									 '{$mysqli->real_escape_string($_POST['input_2_4'])}',
									 '{$mysqli->real_escape_string($_POST['input_3_1'])}',
									 '{$mysqli->real_escape_string($_POST['input_3_2'])}',
									 '{$mysqli->real_escape_string($_POST['input_4'])}',
									 '{$mysqli->real_escape_string($_POST['input_5'])}',
									 '{$mysqli->real_escape_string($_POST['input_6'])}',
									 '{$mysqli->real_escape_string($_POST['input_7'])}',
									 '{$mysqli->real_escape_string($_POST['input_8'])}',
									 '{$mysqli->real_escape_string($_POST['input_9'])}',
									 '{$mysqli->real_escape_string($_POST['input_10'])}',
									 '{$mysqli->real_escape_string($_POST['input_1_1B'])}',
 									 '{$mysqli->real_escape_string($_POST['input_1_2B'])}',
 									 '{$mysqli->real_escape_string($_POST['input_1_3B'])}',
 									 '{$mysqli->real_escape_string($_POST['input_2_1B'])}',
 									 '{$mysqli->real_escape_string($_POST['input_2_2B'])}',
 									 '{$mysqli->real_escape_string($_POST['input_2_3B'])}',
 									 '{$mysqli->real_escape_string($_POST['input_2_4B'])}',
 									 '{$mysqli->real_escape_string($_POST['input_3_1B'])}',
 									 '{$mysqli->real_escape_string($_POST['input_3_2B'])}',
 									 '{$mysqli->real_escape_string($_POST['input_4B'])}',
 									 '{$mysqli->real_escape_string($_POST['input_5B'])}',
 									 '{$mysqli->real_escape_string($_POST['input_6B'])}',
 									 '{$mysqli->real_escape_string($_POST['input_7B'])}',
 									 '{$mysqli->real_escape_string($_POST['input_8B'])}',
 									 '{$mysqli->real_escape_string($_POST['input_9B'])}'
								 )";
	$insert = $mysqli->query($sql);

	// Print response from MySQL
	// if ( $insert ) {
	// 	echo "Success! Row ID: {$mysqli->insert_id}";
	// } else {
	// 	die("Error: {$mysqli->errno} : {$mysqli->error}");
	// }

	// Close our connection
	$mysqli->close();
}

?>


<!-- <!DOCTYPE html> -->
<html>
	<head>
		<meta charset='utf-8'>
		<script src="https://use.typekit.net/ucn5qiq.js"></script>
		<script>try{Typekit.load({ async: true });}catch(e){}</script>
		<link href='./lib/bootstrap.min.css' rel='stylesheet' />
		<link href='global.css' rel='stylesheet' />
	</head>
	<body>

		<div id="before-survey">

				<div class="span col-sm-2 col-md-2 col-lg-2"></div>

				  <div class="col-sm-8 col-md-8 col-lg-8">
						<h1>Part 1: School Choice Survey</h1>
						<p>Imagine you had to choose an elementary school for your child. Answer the following questions based on your decision process.</p>

						<form method="POST" action="" target="frame">

							<!-- Question 1 -->
							<p class="question"><strong>Question 1:</strong> How would you rank the importance of the following charactistics?</p>

							<fieldset class="form-group">
								<label class="form-check-label">Distance from home</label>
								<div class="form-check-inline">
									<label class="form-check-label label-header">Low</label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_1_1" id="distance" value="1"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_1_1" id="distance" value="2"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_1_1" id="distance" value="3"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_1_1" id="distance" value="4"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_1_1" id="distance" value="5"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_1_1" id="distance" value="6"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_1_1" id="distance" value="7"> </label>
									<label class="form-check-label label-header">High</label>
								</div>
								<label class="form-check-label">Average test scores</label>
								<div class="form-check-inline">
									<label class="form-check-label label-header">Low</label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_1_2" id="scores" value="1"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_1_2" id="scores" value="2"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_1_2" id="scores" value="3"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_1_2" id="scores" value="4"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_1_2" id="scores" value="5"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_1_2" id="scores" value="6"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_1_2" id="scores" value="7"> </label>
									<label class="form-check-label label-header">High</label>
								</div>
								<label class="form-check-label" class="label-header">Class and race diversity</label>
								<div class="form-check-inline">
									<label class="form-check-label label-header">Low</label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_1_3" id="diversity" value="1"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_1_3" id="diversity" value="2"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_1_3" id="diversity" value="3"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_1_3" id="diversity" value="4"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_1_3" id="diversity" value="5"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_1_3" id="diversity" value="6"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_1_3" id="diversity" value="7"> </label>
									<label class="form-check-label label-header">High</label>
								</div>
							</fieldset>



							<!-- Question 2 -->
							<p class="question"><strong>Question 2:</strong> Without knowing anything specific about the school, how likely are you to consider a public, private, or a charter school?</p>

							<fieldset class="form-group">
								<label class="form-check-label">Public</label>
								<div class="form-check-inline">
									<label class="form-check-label label-header">Not Likely</label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_2_1" id="public" value="1"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_2_1" id="public" value="2"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_2_1" id="public" value="3"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_2_1" id="public" value="4"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_2_1" id="public" value="5"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_2_1" id="public" value="6"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_2_1" id="public" value="7"> </label>
									<label class="form-check-label label-header">Very Likely</label>
								</div>
								<label class="form-check-label">Private</label>
								<div class="form-check-inline">
									<label class="form-check-label label-header">Not Likely</label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_2_2" id="private" value="1"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_2_2" id="private" value="2"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_2_2" id="private" value="3"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_2_2" id="private" value="4"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_2_2" id="private" value="5"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_2_2" id="private" value="6"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_2_2" id="private" value="7"> </label>
									<label class="form-check-label label-header">Very Likely</label>
								</div>
								<label class="form-check-label">Charter</label>
								<div class="form-check-inline">
									<label class="form-check-label label-header">Not Likely</label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_2_3" id="charter" value="1"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_2_3" id="charter" value="2"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_2_3" id="charter" value="3"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_2_3" id="charter" value="4"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_2_3" id="charter" value="5"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_2_3" id="charter" value="6"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_2_3" id="charter" value="7"> </label>
									<label class="form-check-label label-header">Very Likely</label>
								</div>
							</fieldset>

							<div class="form-group">
								<label for="exampleTextarea">Why?</label>
								<textarea class="form-control" name="input_2_4" id="exampleTextarea" rows="3"></textarea>
							</div>


							<!-- Question 3 -->
							<p class="question"><strong>Question 3:</strong> How would you rank school segregation as a problem?</p>

							<fieldset class="form-group">
								<div class="form-check-inline" class="label-header">
									<label class="form-check-label label-header">Low</label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_3_1" id="problem" value="1"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_3_1" id="problem" value="2"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_3_1" id="problem" value="3"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_3_1" id="problem" value="4"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_3_1" id="problem" value="5"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_3_1" id="problem" value="6"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_3_1" id="problem" value="7"> </label>
									<label class="form-check-label label-header">High</label>
								</div>
							</fieldset>

							<div class="form-group">
								<label for="exampleTextarea">Why?</label>
								<textarea class="form-control" name="input_3_2" id="exampleTextarea" rows="3"></textarea>
							</div>


							<!-- Question 4 -->
							<p class="question"><strong>Question 4:</strong> What do you think accounts for race/class school segregation? </p>

							<div class="form-group">
								<textarea class="form-control" id="exampleTextarea" name="input_4" rows="3"></textarea>
							</div>


							<!-- Question 5 -->
							<p class="question"><strong>Question 5:</strong> How likely are you to support low-income housing in high value neighborhoods?</p>
							<!-- <p class="description">Describe what this means. [Esp for low income and for high income]</p> -->

							<fieldset class="form-group">
								<div class="form-check-inline">
									<label class="form-check-label label-header">Not Likely</label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_5" id="low-income" value="1"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_5" id="low-income" value="2"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_5" id="low-income" value="3"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_5" id="low-income" value="4"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_5" id="low-income" value="5"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_5" id="low-income" value="6"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_5" id="low-income" value="7"> </label>
									<label class="form-check-label label-header">Very Likely</label>
								</div>
							</fieldset>


							<!-- Question 6 -->
							<p class="question"><strong>Question 6:</strong> How likely are you to support a controlled-choice school assignment policy?</p>
							<p class="description">This means that students can apply to schools across the city and are accepted based on balancing the school's socioeconomic make-up.</p>

							<fieldset class="form-group">
								<div class="form-check-inline">
									<label class="form-check-label label-header">Not Likely</label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_6" id="controlled-choice" value="1"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_6" id="controlled-choice" value="2"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_6" id="controlled-choice" value="3"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_6" id="controlled-choice" value="4"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_6" id="controlled-choice" value="5"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_6" id="controlled-choice" value="6"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_6" id="controlled-choice" value="7"> </label>
									<label class="form-check-label label-header">Very Likely</label>
								</div>
							</fieldset>


							<!-- Question 7 -->
							<p class="question"><strong>Question 7:</strong> Do you think your child would be negatively impacted in a school with many low-income or minority students?</p>

							<fieldset class="form-group">
								<div class="form-check-inline">
									<label class="form-check-label label-header">Not Likely</label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_7" id="minority" value="1"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_7" id="minority" value="2"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_7" id="minority" value="3"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_7" id="minority" value="4"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_7" id="minority" value="5"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_7" id="minority" value="6"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_7" id="minority" value="7"> </label>
									<label class="form-check-label label-header">Very Likely</label>
								</div>
							</fieldset>


							<!-- Question 8 -->
							<p class="question"><strong>Question 8:</strong> Do you think your child would be negatively impacted in a racially isolated school? (No exposure to other races/ethnicities.)</p>

							<fieldset class="form-group">
								<div class="form-check-inline">
									<label class="form-check-label label-header">Not Likely</label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_8" id="isolated" value="1"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_8" id="isolated" value="2"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_8" id="isolated" value="3"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_8" id="isolated" value="4"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_8" id="isolated" value="5"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_8" id="isolated" value="6"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_8" id="isolated" value="7"> </label>
									<label class="form-check-label label-header">Very Likely</label>
								</div>
							</fieldset>


							<!-- Question 9 -->
							<p class="question"><strong>Question 9:</strong> Do you think individual parent choices can affect school segregation?</p>

							<fieldset class="form-group">
								<div class="form-check-inline">
									<label class="form-check-label label-header">
										<input type="radio" class="form-check-input" name="input_9" id="choice" value="Yes"> Yes</label>
									<label class="form-check-label label-header">
											<input type="radio" class="form-check-input" name="input_9" id="choice" value="No"> No</label>
								</div>
							</fieldset>


							<!-- Question 10 -->
							<p class="question"><strong>Question 10:</strong> Have you ever had to make a school choice decision or chosen a residence based on school for your child?</p>

							<fieldset class="form-group">
								<div class="form-check-inline">
									<label class="form-check-label label-header">
										<input type="radio" class="form-check-input" name="input_10" id="parent" value="Yes"> Yes</label>
									<label class="form-check-label label-header">
											<input type="radio" class="form-check-input" name="input_10" id="parent" value="No"> No</label>
								</div>
							</fieldset>



							<h1>Part 2: Simulation</h1>
							<p>Please click the button to play the simulation at least three times, exploring several different options.</p>

							<a href="http://schoolchoicegame.com/simulation.html" target="_blank" class="btn btn-primary btn-block btn-lg" id="simulation-btn">Start the Simulation</a>


							<h1>Part 3: School Choice Survey (Again)</h1>
							<p>Please answer the below questions without looking at your previous answers.</p>


							<!-- Question 1B -->
							<p class="question"><strong>Question 1B:</strong> How would you rank the importance of the following charactistics?</p>

							<fieldset class="form-group">
								<label class="form-check-label">Distance from home</label>
								<div class="form-check-inline">
									<label class="form-check-label label-header">Low</label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_1_1B" id="distance" value="1"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_1_1B" id="distance" value="2"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_1_1B" id="distance" value="3"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_1_1B" id="distance" value="4"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_1_1B" id="distance" value="5"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_1_1B" id="distance" value="6"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_1_1B" id="distance" value="7"> </label>
									<label class="form-check-label label-header">High</label>
								</div>
								<label class="form-check-label">Average test scores</label>
								<div class="form-check-inline">
									<label class="form-check-label label-header">Low</label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_1_2B" id="scores" value="1"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_1_2B" id="scores" value="2"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_1_2B" id="scores" value="3"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_1_2B" id="scores" value="4"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_1_2B" id="scores" value="5"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_1_2B" id="scores" value="6"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_1_2B" id="scores" value="7"> </label>
									<label class="form-check-label label-header">High</label>
								</div>
								<label class="form-check-label" class="label-header">Class and race diversity</label>
								<div class="form-check-inline">
									<label class="form-check-label label-header">Low</label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_1_3B" id="diversity" value="1"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_1_3B" id="diversity" value="2"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_1_3B" id="diversity" value="3"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_1_3B" id="diversity" value="4"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_1_3B" id="diversity" value="5"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_1_3B" id="diversity" value="6"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_1_3B" id="diversity" value="7"> </label>
									<label class="form-check-label label-header">High</label>
								</div>
							</fieldset>



							<!-- Question 2B -->
							<p class="question"><strong>Question 2B:</strong> Without knowing anything specific about the school, how likely are you to consider a public, private, or a charter school?</p>

							<fieldset class="form-group">
								<label class="form-check-label">Public</label>
								<div class="form-check-inline">
									<label class="form-check-label label-header">Not Likely</label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_2_1B" id="public" value="1"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_2_1B" id="public" value="2"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_2_1B" id="public" value="3"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_2_1B" id="public" value="4"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_2_1B" id="public" value="5"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_2_1B" id="public" value="6"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_2_1B" id="public" value="7"> </label>
									<label class="form-check-label label-header">Very Likely</label>
								</div>
								<label class="form-check-label">Private</label>
								<div class="form-check-inline">
									<label class="form-check-label label-header">Not Likely</label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_2_2B" id="private" value="1"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_2_2B" id="private" value="2"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_2_2B" id="private" value="3"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_2_2B" id="private" value="4"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_2_2B" id="private" value="5"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_2_2B" id="private" value="6"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_2_2B" id="private" value="7"> </label>
									<label class="form-check-label label-header">Very Likely</label>
								</div>
								<label class="form-check-label">Charter</label>
								<div class="form-check-inline">
									<label class="form-check-label label-header">Not Likely</label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_2_3B" id="charter" value="1"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_2_3B" id="charter" value="2"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_2_3B" id="charter" value="3"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_2_3B" id="charter" value="4"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_2_3B" id="charter" value="5"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_2_3B" id="charter" value="6"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_2_3B" id="charter" value="7"> </label>
									<label class="form-check-label label-header">Very Likely</label>
								</div>
							</fieldset>

							<div class="form-group">
								<label for="exampleTextarea">Why?</label>
								<textarea class="form-control" name="input_2_4B" id="exampleTextarea" rows="3"></textarea>
							</div>


							<!-- Question 3B -->
							<p class="question"><strong>Question 3B:</strong> How would you rank school segregation as a problem?</p>

							<fieldset class="form-group">
								<div class="form-check-inline" class="label-header">
									<label class="form-check-label label-header">Low</label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_3_1B" id="problem" value="1"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_3_1B" id="problem" value="2"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_3_1B" id="problem" value="3"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_3_1B" id="problem" value="4"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_3_1B" id="problem" value="5"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_3_1B" id="problem" value="6"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_3_1B" id="problem" value="7"> </label>
									<label class="form-check-label label-header">High</label>
								</div>
							</fieldset>

							<div class="form-group">
								<label for="exampleTextarea">Why?</label>
								<textarea class="form-control" name="input_3_2B" id="exampleTextarea" rows="3"></textarea>
							</div>


							<!-- Question 4B -->
							<p class="question"><strong>Question 4B:</strong> What do you think accounts for race/class school segregation? </p>

							<div class="form-group">
								<textarea class="form-control" id="exampleTextarea" name="input_4B" rows="3"></textarea>
							</div>


							<!-- Question 5B -->
							<p class="question"><strong>Question 5B:</strong> How likely are you to support low-income housing in high value neighborhoods?</p>
							<!-- <p class="description">Describe what this means. [Esp for low income and for high income]</p> -->

							<fieldset class="form-group">
								<div class="form-check-inline">
									<label class="form-check-label label-header">Not Likely</label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_5B" id="low-income" value="1"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_5B" id="low-income" value="2"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_5B" id="low-income" value="3"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_5B" id="low-income" value="4"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_5B" id="low-income" value="5"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_5B" id="low-income" value="6"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_5B" id="low-income" value="7"> </label>
									<label class="form-check-label label-header">Very Likely</label>
								</div>
							</fieldset>


							<!-- Question 6B -->
							<p class="question"><strong>Question 6B:</strong> How likely are you to support a controlled-choice school assignment policy?</p>
							<p class="description">This means that students can apply to schools across the city and are accepted based on balancing the school's socioeconomic make-up.</p>

							<fieldset class="form-group">
								<div class="form-check-inline">
									<label class="form-check-label label-header">Not Likely</label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_6B" id="controlled-choice" value="1"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_6B" id="controlled-choice" value="2"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_6B" id="controlled-choice" value="3"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_6B" id="controlled-choice" value="4"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_6B" id="controlled-choice" value="5"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_6B" id="controlled-choice" value="6"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_6B" id="controlled-choice" value="7"> </label>
									<label class="form-check-label label-header">Very Likely</label>
								</div>
							</fieldset>


							<!-- Question 7B -->
							<p class="question"><strong>Question 7B:</strong> Do you think your child would be negatively impacted in a school with many low-income or minority students?</p>

							<fieldset class="form-group">
								<div class="form-check-inline">
									<label class="form-check-label label-header">Not Likely</label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_7B" id="minority" value="1"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_7B" id="minority" value="2"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_7B" id="minority" value="3"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_7B" id="minority" value="4"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_7B" id="minority" value="5"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_7B" id="minority" value="6"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_7B" id="minority" value="7"> </label>
									<label class="form-check-label label-header">Very Likely</label>
								</div>
							</fieldset>


							<!-- Question 8B -->
							<p class="question"><strong>Question 8:</strong> Do you think your child would be negatively impacted in a racially isolated school? (No exposure to other races/ethnicities.)</p>

							<fieldset class="form-group">
								<div class="form-check-inline">
									<label class="form-check-label label-header">Not Likely</label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_8B" id="isolated" value="1"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_8B" id="isolated" value="2"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_8B" id="isolated" value="3"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_8B" id="isolated" value="4"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_8B" id="isolated" value="5"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_8B" id="isolated" value="6"> </label>
									<label class="form-check-label"><input type="radio" class="form-check-input" name="input_8B" id="isolated" value="7"> </label>
									<label class="form-check-label label-header">Very Likely</label>
								</div>
							</fieldset>


							<!-- Question 9B -->
							<p class="question"><strong>Question 9B:</strong> Do you think individual parent choices can affect school segregation?</p>

							<fieldset class="form-group">
								<div class="form-check-inline">
									<label class="form-check-label label-header">
										<input type="radio" class="form-check-input" name="input_9B" id="choice" value="Yes"> Yes</label>
									<label class="form-check-label label-header">
											<input type="radio" class="form-check-input" name="input_9B" id="choice" value="No"> No</label>
								</div>
							</fieldset>


							<input type="submit" class="btn btn-primary btn-block btn-lg" value="Submit Form" id="submit">

						</form>

						<!-- <p class="question"><strong>Thank you!</strong></p> -->

				  </div>

				<div class="span col-sm-2 col-md-2 col-lg-2"></div>

		</div>

		<iframe name="frame"></iframe>

		<p class="question-end"><strong>Thank you!</strong></p>
		<p class="question-end">Code: M3L8X6</p>

		<script src='./lib/d3.js' type='text/javascript'></script>
		<script src='./lib/jquery-1.12.4.min.js'></script>
		<script src='./lib/bootstrap.min.js'></script>

		<script type='text/javascript'>
			d3.select('#submit').on('click',function(){
				window.stop()
				d3.select('#before-survey').style('display','none');
				d3.selectAll('.question-end').style('display','block');
			})
		</script>

	</body>
</html>
