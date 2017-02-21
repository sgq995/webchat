<?php

require "core.php";

$response = array();

if (isset($_SESSION['username'])) {
	if (isset($_POST['text'])) {
		$username = $mysql->real_escape_string($_SESSION['username']);
		$text = $mysql->real_escape_string($_POST['text']);
		
		$stmt = $mysql->prepare("INSERT INTO `webchat_lines`(`username`, `text`) VALUES (?, ?)");
		if ($stmt) {
			$stmt->bind_param("ss", $username, $text);
			
			$stmt->execute();
		} else {
			$response['error'] = $mysql->error;
		}
	}
}

echo json_encode($response);

?>
