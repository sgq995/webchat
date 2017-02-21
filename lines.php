<?php

require "core.php";

$response = array();

if (isset($_GET['timestamp'])) {	
	$timestamp = $mysql->real_escape_string($_GET['timestamp']);
	$username = "";
	
	$webchat_lines = $mysql->prepare("SELECT `timestamp`, `username`, `text` FROM `webchat_lines` WHERE `timestamp` > ? ORDER BY `timestamp` DESC LIMIT 10");
	$webchat_powers = $mysql->prepare("SELECT `power`, `data` FROM `webchat_powers` WHERE `username` = ? AND `actived` = 1");
	if ($webchat_lines) {
		$webchat_lines->bind_param("s", $timestamp);
		
		if ($webchat_powers) {
			$webchat_powers->bind_param("s", $username);
		}
		
		session_write_close();		
		do {
			if ($webchat_lines->execute()) {
				$webchat_lines->store_result();
				
				if ($webchat_lines->num_rows > 0) {
					$webchat_lines->bind_result($timestamp, $username, $text);
				
					while ($webchat_lines->fetch()) {
						$powers = array();
						
						if ($webchat_powers) {
							if ($webchat_powers->execute()) {
								$webchat_powers->store_result();
								
								if ($webchat_powers->num_rows > 0) {
									$webchat_powers->bind_result($power, $data);
									
									while ($webchat_powers->fetch()) {
										array_push($powers, array(
											"power" => $power,
											"data" => $data
										));
									}
								}
								
								$webchat_powers->free_result();
							}
						}
						
						array_unshift($response, array(
							"timestamp" => $timestamp,
							"username" => $username,
							"powers" => $powers,
							"text" => $text
						));
					}
					
					break;
				}
				
				$webchat_lines->free_result();
			} else {
				break;
			}
			
			usleep(10000);
			clearstatcache();
		} while (true);
		
		if ($webchat_powers) {
			$webchat_powers->close();
		}
		
		$webchat_lines->close();
	} else {
		$response['error'] = $mysql->error;
	}
}

echo json_encode($response);

?>
