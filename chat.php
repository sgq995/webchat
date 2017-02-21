<?php

$mysql = new mysqli("localhost", "root", "", "chat");
if ($mysql->connect_errno) {
	die(json_encode(array(
		"error" => "Fallo al conectar a MySQL: " . $mysql->connect_error
	)));
}

if (isset($_POST['text']) && isset($_POST['author'])) {
	if ($mysql->query("INSERT INTO `lines`(`text`, `author`) VALUES ('" . $_POST['text'] . "', '" . $_POST['author'] . "')")) {
		die("Inserted");
	} else {
		die("Not inserted " . $mysql->error);
	}
}

?>
