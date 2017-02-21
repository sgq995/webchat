<?php

require "core.php";

$response = array();

if (isset($_POST['username']) && isset($_POST['password'])) {	
	$username = $mysql->real_escape_string($_POST['username']);
	$password = md5($mysql->real_escape_string($_POST['password']));

	$stmt = $mysql->prepare("SELECT `username` FROM `webchat_users` WHERE `username`=? AND `password`=? LIMIT 1");
	if ($stmt) {
		$stmt->bind_param("ss", $username, $password);
		
		$stmt->execute();
		$stmt->store_result();
		
		if ($stmt->num_rows > 0) {
			$_SESSION['username'] = $username;
			$response['logged'] = true;
		} else {
			$response['error'] = "No se encuentra el usuario y la constraseña.";
		}
		
		$stmt->close();
	} else {
		$response['error'] = $mysql->error;
	}
} else {
	$response['error'] = "Es necesario un nombre de usuario y una contraseña.";
}

echo json_encode($response);

?>
