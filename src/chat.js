//(function() {

var chat = {};
chat.container = document.getElementById("chat")
chat.div = document.getElementById("chat-div");
chat.form = document.getElementById("chat-form");
chat.text = document.getElementById("chat-text");

var login = {};
login.container = document.getElementById("login");
login.div = document.getElementById("login-div");
login.form = document.getElementById("login-form");
login.username = document.getElementById("login-username");
login.password = document.getElementById("login-password");

var register = {};
register.container = document.getElementById("register");
register.div = document.getElementById("register-div");
register.form = document.getElementById("register-form");
register.username = document.getElementById("register-username");
register.password = document.getElementById("register-password");

function activePowers(username, line, powers) {
	for (var i = 0; i < powers.length; i++) {
		switch (powers[i].power) {
			case "namecolor":
				username.style.color = "#" + powers[i].data;
				break;
			case "nameglow":
				username.style.textShadow = "0px 0px 2px #" + 
				powers[i].data;
				break;
			default:
				break;
		}
	}
}

var ajax = Ajax.get({
	url : "lines.php",
	
	data : "timestamp=0",
	
	success : function(response) {
		var lines = response.json;
		
		if (lines.length > 0) {
			var div, username, line, text;
			
			for (var i = 0; i < lines.length; i++) {
				div = document.createElement("div");
				
				username = document.createElement("div");
				// username.style.color = "#39A4CD";
				text = document.createTextNode(lines[i].username);
				username.appendChild(text);
				
				line = document.createElement("span");
				// line.style.paddingLeft = "15px";
				text = document.createTextNode(lines[i].text);
				line.appendChild(text);
				
				activePowers(username, text, lines[i].powers);
				// text = document.createTextNode(lines[i].username + ": " + lines[i].text);
				
				div.appendChild(username);
				div.appendChild(line);
				chat.div.appendChild(div);
			}
			
			console.log(lines);
			this.data = "timestamp=" + lines[lines.length - 1].timestamp;
			
			while (chat.div.childElementCount > 10) {
				chat.div.removeChild(chat.div.firstChild);
			}
		}
		
		setTimeout(function() {
			ajax.send();
		}, 100);
	},
	
	failure : function(response) {
		console.log(response);
	}
});

chat.form.addEventListener("submit", function(e) {
	var text = chat.text.value.trim();
	
	if (text.length > 0) {
		var data = "";
		data += "text=" + text;
		
		Ajax.post({
			url : "text.php",
			
			data : data,
			
			success : function(response) {
				chat.text.value = "";
			},
			
			failure : function(response) {
				console.log(response);
			}
		});
	}

	e.preventDefault();
}, false);

login.form.addEventListener("submit", function(e) {
	var username = login.username.value.trim();
	var password = login.password.value.trim();
	
	var data = "";
	data += "username=" + username;
	data += "&password=" + password;
	
	Ajax.post({
		url : "login.php",
		
		data : data,
		
		success : function(response) {
			if (response.json.logged) {
				login.container.style.display = "none";
				register.container.style.display = "none";
			} else if (response.json.error) {
				var error = document.createTextNode(response.json.error);
				login.div.removeChild(login.div.firstChild);
				login.div.appendChild(error);
			}
		},
		
		failure : function(response) {
			console.log(response);
		}
	});
	
	e.preventDefault();
}, false);

register.form.addEventListener("submit", function(e) {
	var username = register.username.value.trim();
	var password = register.password.value.trim();
	
	var data = "";
	data += "username=" + username;
	data += "&password=" + password;
	
	Ajax.post({
		url : "register.php",
		
		data : data,
		
		success : function(response) {
			if (response.json.logged) {
				login.container.style.display = "none";
				register.container.style.display = "none";
			} else if (response.json.error) {
				var error = document.createTextNode(response.json.error);
				register.div.removeChild(register.div.firstChild);
				register.div.appendChild(error); 
			}
		}, 
		
		failure : function(response) {
			console.log(response);
		}
	});
	
	e.preventDefault();
}, false);

//})();
