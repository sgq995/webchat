<?php

require "core.php";

$response = array();

if (isset($_POST['username']) && isset($_POST['password'])) {
	$username = $mysql->real_escape_string($_POST['username']);
	$password = md5($mysql->real_escape_string($_POST['password']));
	
	$stmt = $mysql->prepare("SELECT `username` FROM `webchat_users` WHERE `username`=?");
	if ($stmt) {
		$stmt->bind_param("s", $username);
		
		$stmt->execute();
		$stmt->store_result();
		
		$num_rows = $stmt->num_rows;
		$stmt->close();
		
		if ($num_rows > 0) {
			$response['error'] = "El nombre de usuario ya esta en uso.";
		} else {
			$stmt = $mysql->prepare("INSERT INTO `webchat_users`(`username`, `password`) VALUES (?, ?)");
			if ($stmt) {
				$stmt->bind_param("ss", $username, $password);
				
				if ($stmt->execute()) {
					$_SESSION['username'] = $username;
					$response['logged'] = true;
				} else {
					$response['error'] = $mysql->error;
				}				
				
				$stmt->close();
			} else {
				$response['error'] = $mysql->error;
			}
		}
	} else {
		$response['error'] = $mysql->error;
	}
} else {
	$response['error'] = "Es necesario un nombre de usuario y una constraseña";
}

echo json_encode($response);

?>
