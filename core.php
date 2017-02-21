<?php

require "config.php";

// error_reporting(E_ALL);

session_name("webchat");
session_start();

$mysql = new mysqli($config['host'], $config['username'], 
	$config['password'], $config['database']);
if ($mysql->connect_errno) {
	die("Error to connect mysql server: " . $mysql->connect_error);
}

function shutdown() {
	global $mysql;
	$mysql->close();
}

register_shutdown_function("shutdown");

?>
