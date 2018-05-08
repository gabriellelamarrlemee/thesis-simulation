<?php

// Only process the form if $_POST isn't empty
if ( ! empty( $_POST ) ) {
	print_r($_POST); exit;

	// Connect to MySQL
	$mysqli = new mysqli('localhost','', '', '');

	// Check our connection
	if ( $mysqli->connect_error ) {
		die( 'Connect Error: ' . $mysqli->connect_errno . ': ' .$mysql->connect_error );
	}

	// Insert our data

	// Print response from MySQL

	// Close our connection
}

?>
