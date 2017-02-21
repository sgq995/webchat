function Timer() {
	this.previous = 0;
	
	this.current = 0;
	
	this.elapsed = 0;
}

Timer.prototype.start = function() {
	this.previous = Date.now();
};

Timer.prototype.tick = function() {
	this.current = Date.now();
	this.elapsed = this.current - this.previous;
	this.previous = this.current;
};

function Effect(element, properties) {
	if (typeof properties === "undefined") {
		properties = element;
		element = properties.element;
		delete properties.element;
	}
		
	this.style = element.style;
	
	this.duration = properties.duration || 0;
	
	// this.repeat = properties.repeat || 0;
	
	// this.yoyo = properties.yoyo || false;
	
	// [from, to, unit]
	this.css = properties.css;
	
	// this.timer = new Timer();
	
	// this.time = 0;
	
	this.previous = 0;
	
	this.current = 0;
	
	this.id = 0;
}

Effect.prototype.start = function() {
	for (var property in this.css) {
		this.style[property] = this.css[property];
	}
	
	// this.timer.start();
	// this.time = this.timer.previous;
	
	this.previous = Date.now();
	
	this.id = requestAnimationFrame(this.step.bind(this));
};

Effect.prototype.step = function() {
	this.id = requestAnimationFrame(this.step.bind(this));
	
	// this.timer.tick();
	this.current = Date.now();
	var delta = (this.current - this.previous) / this.duration;
	
	if (this.current <= this.previous + this.duration) {
		var attr;
		for (var property in this.css) {
			attr = this.css[property];
			
			this.style[property] = attr[0] + (attr[1] - attr[0]) * delta + (attr[2] || "");
		}
	} else {
		this.id = cancelAnimationFrame(this.id);
		
		for (var property in this.css) {
			attr = this.css[property];
			
			this.style[property] = attr[1] + attr[2] || "";
		}
	}
};

Effect.prototype.stop = function() {
	this.id = cancelAnimationFrame(this.id);
}

function EffectGroup() {
	this.effects = [];
}

EffectGroup.prototype.add = function(effect) {
	if (this.effects.indexOf(effect) < 0) {
		this.effects.push(effect);
	}
};

EffectGroup.prototype.remove = function(effect) {
	var index = this.element.indexOf(effect);
	if (index > -1) {
		this.effects.splice(index, 1);
	}
};

EffectGroup.prototype.start = function() {
	for (var i = 0; i < this.effects.length; i++) {
		this.effects[i].start();
	}
};

/*EffectGroup.prototype.step = function() {
	for (var i = 0; i < this.effects.length; i++) {
		this.effects[i].step();
	}
};*/

EffectGroup.prototype.stop = function() {
	for (var i = 0; i < this.effects.length; i++) {
		this.effects[i].stop();
	}
};
