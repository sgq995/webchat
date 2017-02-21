function Ajax(url, type) {
	this.url = url;
	
	this.type = type || "GET";
	
	this.async = true;
	
	this.xhr = new XMLHttpRequest();
	
	this.xhr.onreadystatechange = this.onreadystatechange.bind(this);
	
	this.headers = {
		"Content-type" : "application/x-www-form-urlencoded"
	};
	
	this.data = null;
	
	this.type.toUpperCase();
}

Ajax.prototype.success = function(response) {
	
};

Ajax.prototype.failure = function(response) {
	
};

Ajax.prototype.setRequestHeader = function(header, value) {
	this.headers[header] = value;
};

Ajax.prototype.onreadystatechange = function() {
	if (this.xhr.readyState == 4) {
		var response = {};
		response.status = this.xhr.status;
		
		if (this.xhr.status >= 200 && this.xhr.status < 300 || this.xhr.status == 304) {
			response.text = this.xhr.responseText;
			try {
				response.json = JSON.parse(this.xhr.responseText);
			} catch (e) {
				response.json = {};
			}
			
			this.success(response);
		} else {
			this.failure(response);
		}
	}
};

Ajax.prototype.send = function() {
	var url = this.url;
	
	if (this.type == "GET" && typeof this.data === "string") {
		url += "?" + this.data;
	}
	
	this.xhr.open(this.type, url, this.async);
	
	for (var header in this.headers) {
		this.xhr.setRequestHeader(header, this.headers[header]);
	}
	
	if (this.data) {
		this.xhr.send(this.data);
	} else {
		this.xhr.send();
	}
};

Ajax.request = function(url, properties) {
	if (typeof url === "object") {
		properties = url;
		url = properties.url;
		
		delete properties.url;
		
		return Ajax.request(url, properties);
	}
	
	var ajax = new Ajax(url);
	
	for (var property in properties) {
		ajax[property] = properties[property];
	}
	
	ajax.send();
	
	return ajax;
};

Ajax.get = function(url, properties) {
	if (typeof url === "object") {
		properties = url;
		url = properties.url;
		
		delete properties.url;
		
		return Ajax.get(url, properties);
	}
	
	properties.type = "GET";
	return Ajax.request(url, properties);
};

Ajax.post = function(url, properties) {
	if (typeof url === "object") {
		properties = url;
		url = properties.url;
		
		delete properties.url;
		
		return Ajax.post(url, properties);
	}
	
	properties.type = "POST";
	return Ajax.request(url, properties);
};
