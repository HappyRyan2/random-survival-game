const FPS = 60;
const TESTING_MODE = true;

var canvas = document.getElementById("canvas");
var c = canvas.getContext("2d");

var utilities = {
	frameCount: 0,
	canvas: {
		/*
		Utilities related to drawing on the canvas.
		*/
		resize: function() {
			if(window.innerWidth < window.innerHeight) {
				canvas.style.width = "100%";
				canvas.style.height = "";
			}
			else {
				canvas.style.width = "";
				canvas.style.height = "100%";
			}
			if(canvas.style.width === "100%") {
				canvas.style.top = (window.innerHeight / 2) - (window.innerWidth / 2) + "px";
				canvas.style.left = "0px";
			}
			else {
				canvas.style.left = (window.innerWidth / 2) - (window.innerHeight / 2) + "px";
				canvas.style.top = "0px";
			}
		},
		displayTextOverLines: function(text, x, y, width, lineHeight) {
			var lines = [text];
			/* Split text into multiple lines */
			for(var i = 0; i < lines.length; i ++) {
				var currentLine = lines[i];
				while(c.measureText(currentLine).width > width) {
					forLoop: for(var j = currentLine.length; j > 0; j --) {
						if(currentLine.substring(j, j + 1) == " ") {
							var nextLine = lines[i + 1];
							if(nextLine === undefined) {
								nextLine = "";
							}
							movedWord = currentLine.substring(j + 1, Infinity);
							movedWord = movedWord.trim();
							currentLine = currentLine.substring(0, j);
							nextLine = movedWord + " " + nextLine;
							lines[i] = currentLine;
							lines[i + 1] = nextLine;
							break forLoop;
						}
					}
					currentLine = lines[i];
				}
			}
			/* Display the split text */
			var lineY = y;
			for(var i = 0; i < lines.length; i ++) {
				c.fillText(lines[i], x, lineY);
				lineY += lineHeight;
			}
		}
	},
	pastInputs: {
		/*
		Utility variables used for remembering the values of inputs 1 frame ago.
		*/
		mouse: {
			x: 0,
			y: 0,
			pressed: false
		},
		keys: [],
		update: function() {
			utilities.pastInputs.mouse.x = input.mouse.x;
			utilities.pastInputs.mouse.y = input.mouse.y;
			utilities.pastInputs.mouse.pressed = input.mouse.pressed;
			for(var i = 0; i < input.keys.length; i ++) {
				utilities.pastInputs.keys[i] = input.keys[i];
			}
		}
	},
	sort: function(array, comparison) {
		/*
		Used when JavaScript's Array.sort() doesn't work because of sorting instability or strange comparison functions. Implements Selection Sort.
		*/
		var numSorted = 0;
		while(numSorted < array.length) {
			var lowest = numSorted;
			for(var i = numSorted; i < array.length; i ++) {
				if(comparison(array[lowest], array[i]) == 1) {
					lowest = i;
				}
			}
			array.swap(numSorted, lowest);
			numSorted ++;
		}
		return array;
	}
};
var input = {
	mouse: {
		x: 0,
		y: 0,
		pressed: false,
	},
	keys: [],
	getMousePos: function(event) {
		var canvasRect = canvas.getBoundingClientRect();
		input.mouse.x = (event.clientX - canvasRect.left) / (canvasRect.right - canvasRect.left) * canvas.width;
		input.mouse.y = (event.clientY - canvasRect.top) / (canvasRect.bottom - canvasRect.top) * canvas.height;
	},
	initialized: function() {
		document.body.onmousemove = function() {
			input.getMousePos(event);
		};
		document.body.onmousedown = function() {
			input.mouse.pressed = true;
		};
		document.body.onmouseup = function() {
			input.mouse.pressed = false;
		};
		document.body.onkeydown = function() {
			input.keys[event.which] = true;
		};
		document.body.onkeyup = function() {
			input.keys[event.which] = false;
		};
		return true;
	} ()
};

console. logOnce = function(parameter) {
	/*
	Logs the value to the console, but only the first time it is called.
	Note that if you call this function from multiple places in the code, it will log once for each of those places.
	*/
	var trace = new Error().stack;
	console.traces = console.traces || [];
	if(!console.traces.contains(trace)) {
		console.traces.push(trace);
		console. log(parameter);
	}
};
Object.prototype.clone = function() {
	var clone = new this.constructor();
	for(var i in this) {
		if(this.hasOwnProperty(i)) {
			if(typeof this[i] === "object" && this[i] !== null) {
				clone[i] = this[i].clone();
			}
			else {
				clone[i] = this[i];
			}
		}
	}
	return clone;
};
Array.prototype.contains = function(obj) {
	for(var i = 0; i < this.length; i ++) {
		if(this[i] === obj) {
			return true;
		}
	}
	return false;
};
Array.prototype.removeAll = function(item) {
	for(var i = 0; i < this.length; i ++) {
		if(this[i] === item) {
			this.splice(i, 1);
			i --;
		}
	}
};
Array.prototype.swap = function(index1, index2) {
	var previousIndex1 = this[index1];
	this[index1] = this[index2];
	this[index2] = previousIndex1;
};
Array.prototype.randomItem = function() {
	var index = Math.floor(Math.random() * this.length);
	return this[index];
};
Math.dist = function(x1, y1, x2, y2) {
	return Math.hypot(x1 - x2, y1 - y2);
};
Math.map = function(value, min1, max1, min2, max2) {
	/*
	Maps 'value' from range ['min1' - 'max1'] to ['min2' - 'max2']
	*/
	return (value - min1) / (max1 - min1) * (max2 - min2) + min2;
};
Math.rotateDegrees = function(x, y, deg) {
	var rad = (deg / 180.0) * Math.PI;
	return Math.rotate(x, y, rad);
};
Math.rotate = function(x, y, rad) {
	return {
		x: x * Math.cos(rad) - y * Math.sin(rad),
		y: x * Math.sin(rad) + y * Math.cos(rad)
	};
};
Math.findPointsCircular = function(x, y, r) {
	var circularPoints = [];
	/* top right quadrant */
	for(var X = x; X < x + r; X ++) {
		for(var Y = y - r; Y < y; Y ++) {
			if(Math.floor(Math.dist(x, y, X, Y)) === r - 1) {
				circularPoints.push({x: X, y: Y});
			}
		}
	}
	/* bottom right quadrant */
	for(var X = x + r; X > x; X --) {
		for(var Y = y; Y < y + r; Y ++) {
			if(Math.floor(Math.dist(x, y, X, Y)) === r - 1) {
				circularPoints.push({x: X, y: Y});
			}
		}
	}
	/* bottom left */
	for(var X = x; X > x - r; X --) {
		for(var Y = y + r; Y > y; Y --) {
			if(Math.floor(Math.dist(x, y, X, Y)) === r - 1) {
				circularPoints.push({x: X, y: Y});
			}
		}
	}
	/* top left */
	for(var X = x - r; X < x; X ++) {
		for(var Y = y; Y > y - r; Y --) {
			if(Math.floor(Math.dist(x, y, X, Y)) === r - 1) {
				circularPoints.push({x: X, y: Y});
			}
		}
	}
	return circularPoints;
};
Math.findPointsLinear = function(x1, y1, x2, y2) {
	/*
	Returns all points on a line w/ endpoints ('x1', 'y1') and ('x2', 'y2') rounded to nearest integer.
	*/
	var inverted = false;
	/* Swap x's and y's if the line is closer to vertical than horizontal */
	if(Math.abs(x1 - x2) < Math.abs(y1 - y2)) {
		inverted = true;
		[x1, y1] = [y1, x1];
		[x2, y2] = [y2, x2];
	}
	/* Calculate line slope */
	var m = Math.abs(y1 - y2) / Math.abs(x1 - x2);
	/* Find points on line */
	var linearPoints = [];
	if(x1 < x2) {
		if(y1 < y2) {
			var y = y1;
			for(var x = x1; x < x2; x ++) {
				y += m;
				linearPoints.push({x: x, y: y});
			}
		}
		else if(y2 < y1) {
			var y = y2;
			for(var x = x2; x > x1; x --) {
				y += m;
				linearPoints.push({x: x, y: y});
			}
		}
	}
	else if(x2 < x1) {
		if(y1 < y2) {
			var y = y1;
			for(var x = x1; x > x2; x --) {
				y += m;
				linearPoints.push({x: x, y: y});
			}
		}
		else if(y2 < y1) {
			var y = y2;
			for(var x = x2; x < x1; x ++) {
				y += m;
				linearPoints.push({x: x, y: y});
			}
		}
	}
	if(x1 === x2) {
		for(var y = (y1 < y2) ? y1 : y2; y < (y1 < y2) ? y2 : y1; y ++) {
			linearPoints.push({x: x1, y: y});
		}
	}
	else if(y1 === y2) {
		if(x1 < x2) {
			for(var x = x1; x < x2; x ++) {
				linearPoints.push({x: x, y: y1});
			}
		}
		if(x2 < x1) {
			for(var x = x2; x < x1; x ++) {
				linearPoints.push({x: x, y: y1});
			}
		}
	}
	/* Swap it again to cancel out previous swap and return */
	if(inverted) {
		for(var i = 0; i < linearPoints.length; i ++) {
			[linearPoints[i].x, linearPoints[i].y] = [linearPoints[i].y, linearPoints[i].x];
		}
	}
	return linearPoints;
};
Math.constrain = function(num, min, max) {
	/*
	Returns 'num' constrained to be between 'min' and 'max'.
	*/
	num = Math.min(num, max);
	num = Math.max(num, min);
	return num;
};

function Player() {
	/* Location + velocity */
	this.x = 400;
	this.y = 300;
	this.velX = 0;
	this.velY = 0;
	this.worldY = 0;
	/* Player animation properties */
	this.legs = 5;
	this.legDir = 1;
	this.facing = "forward";
	this.armHeight = 10;
	/* Effect properties */
	this.timeConfused = 0;
	this.timeBlinded = 0;
	this.timeNauseated = 0;
	this.nauseaOffsetArray = Math.findPointsCircular(0, 0, 30);
	this.nauseaOffset = 0;
	/* Scoring */
	this.score = -1;
	this.highScore = 0;
	this.coins = 0; // number of coins collected in the current game
	this.totalCoins = 0;
	this.itemsEquipped = 0;
	this.hasDoubleJumped = false;
	/* Shop item properties */
	this.invincible = 0;
	this.numRevives = 1;
	this.canExtendJump = true;
	this.timeExtended = 0;
	/* Achievement properties */
	this.eventsSurvived = [];
	this.repeatedEvent = false;
	this.previousEvent = "nothing";
	this.numRecords = 0;
	this.gonePlaces = false;
	this.beenGhost = false;
};
Player.prototype.display = function() {
	/*
	The player is a rectangle. 10 wide, 46 tall. (this.x, this.y) is at the middle of the top of the rectangle.
	*/
	if(this.invincible < 0 || utilities.frameCount % 2 === 0) {
		c.lineWidth = 5;
		c.lineCap = "round";
		/* head */
		c.fillStyle = "rgb(0, 0, 0)";
		c.save();
		c.translate(this.x, this.y);
		c.scale(1, 1.2);
		c.beginPath();
		c.arc(0, 12, 10, 0, 2 * Math.PI);
		c.fill();
		c.restore();
		/* eyes */
		if(this.facing === "left" || this.facing === "forward") {
			c.fillStyle = "rgb(200, 200, 200)";
			c.beginPath();
			c.arc(this.x - 4, this.y + 10, 3, 0, 2 * Math.PI);
			c.fill();
		}
		if(this.facing === "right" || this.facing === "forward") {
			c.fillStyle = "rgb(200, 200, 200)";
			c.beginPath();
			c.arc(this.x + 4, this.y + 10, 3, 0, 2 * Math.PI);
			c.fill();
		}
		/* body */
		c.strokeStyle = "rgb(0, 0, 0)";
		c.beginPath();
		c.moveTo(this.x, this.y + 15);
		c.lineTo(this.x, this.y + 36);
		c.stroke();
		/* legs */
		c.beginPath();
		c.moveTo(this.x, this.y + 36);
		c.lineTo(this.x - this.legs, this.y + 46);
		c.moveTo(this.x, this.y + 36);
		c.lineTo(this.x + this.legs, this.y + 46);
		c.stroke();
		/* leg animations */
		this.legs += this.legDir;
		if(input.keys[37] || input.keys[39]) {
			if(this.legs >= 5) {
				this.legDir = -0.5;
			}
			else if(this.legs <= -5) {
				this.legDir = 0.5;
			}
		}
		else {
			this.legDir = 0;
			this.legDir = (this.legs > 0) ? 0.5 : -0.5;
			this.legDir = (this.legs <= -5 || this.legs >= 5) ? 0 : this.legDir;
		}
		/* arms */
		c.beginPath();
		c.moveTo(this.x, this.y + 26);
		c.lineTo(this.x + 10, this.y + 26 + this.armHeight);
		c.moveTo(this.x, this.y + 26);
		c.lineTo(this.x - 10, this.y + 26 + this.armHeight);
		c.stroke();
		c.lineCap = "butt";
	}
};
Player.prototype.update = function() {
	this.timeConfused --;
	this.timeBlinded --;
	this.timeNauseated --;
	this.invincible --;
	this.nauseaOffset ++;
	if(this.nauseaOffset >= 190) {
		this.nauseaOffset = 0;
	}
	if(this.timeConfused === 0 || this.timeBlinded === 0 || this.timeNauseated === 0) {
		effects.add();
	}
	if(this.timeConfused === 0) {
		this.surviveEvent("confusion");
	}
	if(this.timeNauseated === 0) {
		this.surviveEvent("nauesea");
	}
	if(this.timeBlinded === 0) {
		this.surviveEvent("blindness");
	}
	/* walking */
	if(input.keys[37]) {
		this.facing = "left";
		this.velX -= speedIncreaser.equipped ? 0.2 : 0.1;
	}
	else if(input.keys[39]) {
		this.facing = "right";
		this.velX += speedIncreaser.equipped ? 0.2 : 0.1;
	}
	this.x += this.velX;
	this.y += this.velY;
	/* jumping */
	var jumpedThisFrame = false;
	if(input.keys[38] && this.velY === 0) {
		this.velY = -6;
		jumpedThisFrame = true;
		if(!input.keys[37] && !input.keys[39]) {
			this.facing = "forward";
		}
	}
	if(this.velY === 0) {
		this.armHeight += (this.armHeight < 10) ? 1 : 0;
	}
	else {
		this.armHeight += (this.armHeight > -5) ? -1 : 0;
	}
	/* gravity */
	this.velY += 0.1;
	/* Collisions */
	if(intangibilityTalisman.upgrades >= 1) {
		if(this.x > 800) {
			this.x = 0;
		}
		else if(this.x < 0) {
			this.x = 800;
		}
		if(this.usedRevive) {
			this.beenGhost = true;
		}
	}
	if(this.x < 10 && !(intangibilityTalisman.equipped && input.keys[40] && intangibilityTalisman.upgrades >= 1)) {
		this.velX = 1;
	}
	if(this.x > 790 && !(intangibilityTalisman.equipped && input.keys[40] && intangibilityTalisman.upgrades >= 1)) {
		this.velX = -1;
	}
	/* movement cap */
	if(this.velX > 3 && !speedIncreaser.equipped) {
		this.velX = 3;
	}
	else if(this.velX < -3 && !speedIncreaser.equipped) {
		this.velX = -3;
	}
	if(this.velX < -4.5 && (!speedIncreaser.equipped || speedIncreaser.upgrades < 2)) {
		this.velX = -4.5;
	}
	else if(this.velX > 4.5 && (!speedIncreaser.equipped || speedIncreaser.upgrades < 2)) {
		this.velX = 4.5;
	}
	if(this.velX > 6) {
		this.velX = 6;
	}
	else if(this.velX < -6) {
		this.velX = -6;
	}
	if(this.velY > 6) {
		this.velY = 6;
	}
	/* high jumping */
	if(this.canExtendJump && input.keys[38] && this.timeExtended < 40 && doubleJumper.equipped) {
		this.velY = -6;
		this.timeExtended ++;
	}
	if(!input.keys[38]) {
		this.canExtendJump = false;
	}
	/* friction */
	if(!input.keys[37] && !input.keys[39]) {
		this.velX *= 0.93;
	}
	/* double jumping */
	if(doubleJumper.equipped && doubleJumper.upgrades >= 1) {
		if(this.velY !== 0 && !this.hasDoubleJumped && input.keys[38] && !utilities.pastInputs.keys[38] && !jumpedThisFrame) {
			this.velY = -6;
			this.hasDoubleJumped = true;
			if(doubleJumper.upgrades >= 2) {
				this.canExtendJump = true;
				this.timeExtended = 0;
			}
			if(this.velX > 3 || this.velX < -3) {
				this.gonePlaces = true;
			}
			game.objects.push(new DoubleJumpParticle(this.x, this.y + 46));
		}
	}
};
Player.prototype.die = function(cause) {
	if(this.invincible < 0) {
		if(secondLife.equipped && this.numRevives > 0) {
			this.numRevives --;
			this.invincible = (secondLife.upgrades >= 1) ? FPS * 2 : FPS;
		}
		else {
			game.screen = "death";
			this.deathCause = cause;
			this.totalCoins += this.coins;
		}
	}
	else if(this.y + 46 > 800) {
		this.y = 800 - 46;
		if(input.keys[39]) {
			this.velY = -7;
		}
	}
};
Player.prototype.surviveEvent = function(event) {
	/*
	Adds the event to the player's list of events survived if the event is not already present in the list. Used for achievement "I Survived".
	*/
	for(var i = 0; i < this.eventsSurvived.length; i ++) {
		if(this.eventsSurvived[i] === event) {
			return;
		}
	}
	this.eventsSurvived.push(event);
};
Player.prototype.reset = function() {
	this.score = 0;
	this.coins = 0;
	this.x = 400;
	this.y = 300;
	this.velX = 0;
	this.velY = 0;
	this.facing = "forward";
	this.armHeight = 10; 
	this.worldY = 0;
	game.timeToEvent = FPS;
	game.objects = [];
	game.initializePlatforms();
	game.chatMessages = [];
	game.currentEvent = null;
	this.timeNauseated = -5;
	this.timeConfused = -5;
	this.timeBlinded = -5;
	this.invincible = 0;
	this.usedRevive = false;
	this.coins = 0;
	if(!TESTING_MODE) {
		effects.add();
	}
	if(secondLife.equipped) {
		this.numRevives = (secondLife.upgrades >= 2) ? 2 : 1;
	}
	else {
		this.numRevives = 0;
	}
};
var p = new Player();

function Platform(x, y, w, h) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.origX = x;
	this.origY = y;
	this.velX = 0;
	this.velY = 0;
	this.destX = x;
	this.destY = y;
	this.opacity = 1;
};
Platform.prototype.calculateVelocity = function() {
	this.velX = (this.x - this.destX) / -120;
	this.velY = (this.y - this.destY) / -120;
};
Platform.prototype.update = function() {
	this.opacity += (this.opacity < 1) ? 0.05 : 0;
	this.y += p.worldY;
	/* Collisions */
	const COLLISION_BUFFER = 6;
	var collidesWithTop = false;
	if(!(input.keys[40] && intangibilityTalisman.equipped)) {
		/* Top */
		if(p.x + 5 >= this.x && p.x - 5 <= this.x + this.w && p.y + 46 >= this.y && p.y + 46 <= this.y + Math.max(/*COLLISION_BUFFER*/10, p.velY) + this.velY + 2) {
			collidesWithTop = true;
		}
		/* Bottom */
		if(p.x + 5 >= this.x && p.x - 5 <= this.x + this.w && p.y - COLLISION_BUFFER <= this.y + this.h && p.y >= this.y + this.h) {
			p.velY = Math.max(1, p.velY);
			p.y = Math.max(this.y + this.h, p.y);
		}
		/* Left */
		if(p.y - 5 < this.y + this.h && p.y + 46 + COLLISION_BUFFER > this.y + this.h && p.x + 5 > this.x && p.x + 5 < this.x + (this.w / 2)) {
			p.velX = Math.min(this.velX - 1, p.velX);
			p.x = Math.min(p.x, this.x - 5);
		}
		/* Right */
		if(p.y - 5 < this.y + this.h && p.y + 46 + COLLISION_BUFFER > this.y + this.h && p.x - 5 < this.x + this.w && p.x - 5 > this.x + (this.w / 2)) {
			p.velX = Math.max(this.velX + 1, p.velX);
			p.x = Math.max(p.x, this.x + this.w + 5);
		}
	}

	this.x += this.velX;
	this.y += this.velY;

	if(collidesWithTop) {
		p.velY = Math.min(p.velY, 0);
		p.y = Math.min(this.y - 46, p.y);
		p.hasDoubleJumped = false;
		p.canExtendJump = true;
		p.timeExtended = 0;
		p.x += this.velX;
		p.y = this.y - 46;
	}

	if(this.x + 2 > this.destX && this.x - 2 < this.destX && this.y + 2 > this.destY && this.y - 2 < this.destY && (this.velX !== 0 || this.velY !== 0)) {
		this.velX = 0;
		this.velY = 0;
		this.x = this.origX;
		this.y = this.origY;
		var numMoving = 0;
		for(var i = 0; i < game.objects.length; i ++) {
			if(game.objects[i] instanceof Platform && (game.objects[i].velX !== 0 || game.objects[i].velY !== 0)) {
				numMoving ++;
			}
		}
		if(numMoving === 0) {
			game.addEvent();
			p.surviveEvent("block shuffle");
		}
	}
	this.y -= p.worldY;
};
Platform.prototype.display = function() {
	c.globalAlpha = this.opacity;
	this.y += p.worldY;
	c.fillStyle = "rgb(100, 100, 100)";
	c.fillRect(this.x, this.y, this.w, this.h);
	this.y -= p.worldY;
	c.globalAlpha = 1;
};

function DollarIcon() {
	/*
	This is for the dollar icons that fall from the sky when you hover over the shop button.
	*/
	this.x = Math.random() * 100 + 225;
	this.y = 450;
};
DollarIcon.prototype.display = function() {
	c.fillStyle = "rgb(100, 100, 100)";
	c.font = "20px cursive";
	c.fillText("$", this.x, this.y);
	this.y += 5;
};
var dollarIcons = [];
function Button(x, y, whereTo, icon) {
	this.x = x;
	this.y = y;
	this.whereTo = whereTo;
	this.icon = icon;
	this.mouseOver = false;
	this.r = 0;
	this.rDir = 0;
	this.doorX = 0;
	this.mousedOverBefore = false;
};
Button.prototype.display = function() {
	if(this.icon === "play") {
		/* button outline */
		c.strokeStyle = "rgb(100, 100, 100)";
		c.lineWidth = 5;
		c.beginPath();
		c.arc(this.x, this.y, 75, 0, 2 * Math.PI);
		c.stroke();
		/* small triangle (mouse is not over) */
		if(!this.mouseOver) {
			c.fillStyle = "rgb(100, 100, 100)";
			c.beginPath();
			c.moveTo(this.x - 15, this.y - 22.5);
			c.lineTo(this.x - 15, this.y + 22.5);
			c.lineTo(this.x + 30, this.y);
			c.fill();
		}
		/* big triangle (mouse is over) */
		else {
			c.fillStyle = "rgb(100, 100, 100)";
			c.beginPath();
			c.moveTo(this.x - 20, this.y - 30);
			c.lineTo(this.x - 20, this.y + 30);
			c.lineTo(this.x + 40, this.y);
			c.fill();
		}
	}
	else if(this.icon === "question") {
		/* button outline */
		c.strokeStyle = "rgb(100, 100, 100)";
		c.lineWidth = 5;
		c.beginPath();
		c.arc(this.x, this.y, 50, 0, 2 * Math.PI);
		c.stroke();
		/* question mark */
		c.fillStyle = "rgb(100, 100, 100)";
		c.textAlign = "center";
		c.save();
		c.translate(this.x, this.y);
		c.rotate(this.r);
		c.fillText("?", 0, 15);
		c.restore();
		if(this.mouseOver && this.r < 0.5) {
			this.r += 0.05;
		}
		if(!this.mouseOver && this.r > 0) {
			this.r -= 0.05;
		}
	}
	else if(this.icon === "gear") {
		/* button outline */
		c.strokeStyle = "rgb(100, 100, 100)";
		c.lineWidth = 5;
		c.beginPath();
		c.arc(this.x, this.y, 50, 0, 2 * Math.PI);
		c.stroke();
		/* gear body */
		c.fillStyle = "rgb(100, 100, 100)";
		c.beginPath();
		c.arc(this.x, this.y, 20, 0, 2 * Math.PI);
		c.fill();
		/* gear prongs */
		for(var r = 0; r < 2 * Math.PI; r += (2 * Math.PI) / 9) {
			c.save();
			c.translate(this.x, this.y);
			c.rotate(r + this.r);
			c.fillRect(-5, -28, 10, 28);
			c.restore();
		}
		if(this.mouseOver) {
			this.r += 0.05;
		}
	}
	else if(this.icon === "dollar") {
		/* button outline */
		c.strokeStyle = "rgb(100, 100, 100)";
		c.lineWidth = 5;
		c.beginPath();
		c.arc(this.x, this.y, 50, 0, 2 * Math.PI);
		c.stroke();
		/* dollar sign */
		c.fillStyle = "rgb(100, 100, 100)";
		c.font = "50px cursive";
		c.fillText("$", this.x, this.y + 15);
		/* dollar sign animation */
		if(this.mouseOver && utilities.frameCount % 10 === 0) {
			dollarIcons.push(new DollarIcon());
		}
		if(dollarIcons.length > 0) {
			for(var x = this.x - 70; x < this.x + 70; x ++) {
				for(var y = this.y - 70; y < this.y + 70; y ++) {
					if(Math.dist(x, y, this.x, this.y) > 52.5) {
						c.fillStyle = "rgb(200, 200, 200)";
						c.fillRect(x, y, 1, 1);
					}
				}
			}
			var g = c.createRadialGradient(this.x, this.y, 52, this.x, this.y, 53);
			g.addColorStop(0, "rgba(200, 200, 200, 0)");
			g.addColorStop(1, "rgba(200, 200, 200, 255)");
			c.fillStyle = g;
			c.fillRect(this.x - 70, this.y - 70, 140, 140);
		}
	}
	else if(this.icon === "trophy") {
		/* rays of light */
		if(this.mouseOver) {
			this.r += 1;
			if(this.r > 50) {
				this.r = 0;
			}
			c.strokeStyle = "rgb(170, 170, 170)";
			c.beginPath();
			c.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
			c.stroke();
			for(var r = 0; r < 2 * Math.PI; r += (2 * Math.PI) / 8) {
				c.save();
				c.translate(this.x, this.y);
				c.rotate(r);
				c.fillStyle = "rgb(200, 200, 200)";
				c.beginPath();
				c.moveTo(0, 0);
				c.lineTo(-10, -50);
				c.lineTo(10, -50);
				c.fill();
				c.restore();
			}
		}
		/* button outline */
		c.strokeStyle = "rgb(100, 100, 100)";
		c.lineWidth = 5;
		c.beginPath();
		c.arc(this.x, this.y, 50, 0, 2 * Math.PI);
		c.stroke();
		/* trophy base */
		c.fillStyle = "rgb(100, 100, 100)";
		c.beginPath();
		c.arc(this.x, this.y + 23, 13, -3.14159, 0);
		c.fill();
		/* trophy support */
		c.fillRect(this.x - 5, this.y - 2, 10, 20);
		/* trophy cup */
		c.beginPath();
		c.save();
		c.translate(this.x, this.y - 22);
		c.scale(1, 1.5);
		c.arc(0, 0, 20, 0, 3.14159);
		c.restore();
		c.fill();
	}
	else if(this.icon === "house") {
		/* button outline */
		c.strokeStyle = "rgb(100, 100, 100)";
		c.beginPath();
		c.arc(this.x, this.y, 50, 0, 2 * Math.PI);
		c.stroke();
		/* house icon */
		c.fillStyle = "rgb(100, 100, 100)";
		c.fillRect(this.x - 20, this.y - 15, 15, 35);
		c.fillRect(this.x - 20, this.y - 15, 40, 15);
		c.fillRect(this.x + 5, this.y - 15, 15, 35);
		c.beginPath();
		c.moveTo(this.x - 30, this.y - 10);
		c.lineTo(this.x + 30, this.y - 10);
		c.lineTo(this.x, this.y - 30);
		c.fill();
		/* animated door */
		c.fillRect(this.x + this.doorX - 6, this.y - 1, 12, 21);
		if(this.mouseOver) {
			if(this.doorX < 11) {
				this.doorX ++;
			}
		}
		else {
			if(this.doorX > 0) {
				this.doorX --;
			}
		}
	}
	else if(this.icon === "retry") {
		/* button outline */
		c.strokeStyle = "rgb(100, 100, 100)";
		c.beginPath();
		c.arc(this.x, this.y, 50, 0, 2 * Math.PI);
		c.stroke();
		/* retry icon */
		c.save();
		c.translate(this.x, this.y);
		if(this.mouseOver) {
			c.rotate(0.5 * Math.PI);
		}
		c.beginPath();
		c.arc(0, 0, 30, 0.5 * Math.PI, 2 * Math.PI);
		c.stroke();
		c.beginPath();
		c.moveTo(15, 0);
		c.lineTo(45, 0);
		c.lineTo(30, 20);
		c.fill();
		c.restore();
	}
	this.mousedOverBefore = this.mouseOver;
};
Button.prototype.hasMouseOver = function() {
	return Math.hypot(input.mouse.x - this.x, input.mouse.y - this.y) < ((this.icon === "play") ? 75 : 50);
};
Button.prototype.checkForClick = function() {
	if(this.mouseOver && input.mouse.pressed && !utilities.pastInputs.mouse.pressed) {
		game.screen = this.whereTo;
		if(this.icon === "retry" || this.icon === "play") {
			p.reset();
		}
	}
};
var playButton = new Button(400, 400, "play", "play");
var shopButton = new Button(275, 500, "shop", "dollar");
var achievementsButton = new Button(525, 500, "achievements", "trophy");
var homeFromDeath = new Button(266, 650, "home", "house");
var homeFromShop = new Button(75, 75, "home", "house");
var homeFromAchievements = new Button(75, 75, "home", "house");
var retryButton = new Button(533, 650, "play", "retry");

function DoubleJumpParticle(x, y) {
	this.x = x;
	this.y = y;
	this.size = 2;
	this.op = 1;
};
DoubleJumpParticle.prototype.display = function() {
	c.globalAlpha = this.op;
	c.strokeStyle = "rgb(255, 255, 0)";
	c.lineWidth = 5;
	c.beginPath();
	c.save();
	c.translate(this.x, this.y + p.worldY);
	c.scale(this.size, 1);
	c.arc(0, 0, 5, 0, 2 * Math.PI);
	c.stroke();
	c.restore();
	this.size += 0.1;
	this.op -= 0.02;
	c.globalAlpha = 1;
};
DoubleJumpParticle.prototype.update = function() {
	if(this.op <= 0) {
		this.splicing = true;
	}
};
function ShopItem(x, y, name, description, price) {
	this.x = x;
	this.y = y;
	this.name = name;
	this.description = description;
	this.price = price;
	this.infoOp = 0;
	this.mouseOver = false;
	this.bought = false;
	this.equipped = false;
	this.origX = x;
	this.origY = y;
	this.upgrades = 0;
	this.showingPopup = false;
};
ShopItem.prototype.displayLogo = function(size) {
	if(size === 1) {
		this.x = this.origX;
		this.y = this.origY;
	}
	c.save();
	c.translate(this.x, this.y);
	c.scale(size, size);
	c.strokeStyle = "rgb(100, 100, 100)";
	c.fillStyle = "rgb(200, 200, 200)";
	c.lineWidth = 5;
	c.beginPath();
	c.arc(0, 0, 75, 0, 2 * Math.PI);
	c.stroke();
	if(size !== 1) {
		c.fill();
	}
	c.beginPath();
	c.fillStyle = (this.equipped) ? "rgb(100, 100, 100)" : "rgb(200, 200, 200)";
	c.strokeStyle = "rgb(100, 100, 100)";
	c.arc(50, -50, 20, 0, 2 * Math.PI);
	if(this.bought && this.name !== "Box of Storage") {
		c.fill();
		c.stroke();
		c.fillStyle = (this.equipped) ? "rgb(200, 200, 200)" : "rgb(100, 100, 100)";
		c.textAlign = "center";
		c.font = "bold 20px monospace";
		c.fillText(this.upgrades + 1, 50, -45);
	}
	if(this.name === "Piggy Bank of Money") {
		c.save();
		c.translate(10, 0);
		/* body */
		c.fillStyle = (this.bought) ? "rgb(223, 160, 171)" : "rgb(100, 100, 100)";
		c.beginPath();
		c.arc(0, 0, 30, 30, 0, 2 * Math.PI);
		c.fill();
		/* legs */
		c.fillRect(0 - 20, 0, 15, 35);
		c.fillRect(0 + 5, 0, 15, 35);
		/* head */
		c.beginPath();
		c.arc(0 - 40, 0 - 10, 20, 0, 2 * Math.PI);
		c.fill();
		/* chin */
		c.beginPath();
		c.moveTo(0 - 40, 0 + 10);
		c.lineTo(0, 0 + 20);
		c.lineTo(0, 0);
		c.fill();
		/* head - whitespace */
		c.fillStyle = "rgb(200, 200, 200)";
		c.beginPath();
		c.arc(0 - 50, 0 - 20, 20, 0, 2 * Math.PI);
		c.fill();
		/* coin slot - whitespace */
		c.strokeStyle = "rgb(200, 200, 200)";
		c.beginPath();
		c.arc(0, 0, 20, 1.5 * Math.PI - 0.6, 1.5 * Math.PI + 0.6);
		c.stroke();
		c.restore();
	}
	else if(this.name === "Boots of Speediness") {
		/* boots */
		c.fillStyle = (this.bought) ? "rgb(0, 223, 0)" : "rgb(100, 100, 100)";
		c.fillRect(0 - 10, 0 + 46, 20, 5);
		c.fillRect(0 + 30, 0 + 46, 20, 5);
		/* stickman body + limbs */
		c.strokeStyle = (this.bought) ? "rgb(0, 0, 0)" : "rgb(100, 100, 100)";
		c.beginPath();
		c.moveTo(0 - 10, 0 - 10);
		c.lineTo(0 + 10, 0 + 10);
		c.lineTo(0 - 10, 0 + 30);
		c.lineTo(0 + 10, 0 + 50);
		c.moveTo(0 + 10, 0 + 10);
		c.lineTo(0 + 50, 0 + 50);
		c.moveTo(0 + 10, 0 - 30);
		c.lineTo(0 - 30, 0 + 10);
		c.lineTo(0 - 50, 0 - 10);
		c.moveTo(0 + 10, 0 - 30);
		c.lineTo(0 + 30, 0 - 10);
		c.stroke();
		/* stickman head */
		c.beginPath();
		c.fillStyle = (this.bought) ? "rgb(0, 0, 0)" : "rgb(100, 100, 100)";
		c.arc(0 - 17, 0 - 17, 10, 0, 2 * Math.PI);
		c.fill();
	}
	else if(this.name === "Potion of Jumpiness") {
		/* potion */
		c.fillStyle = (this.bought) ? "rgb(255, 255, 0)" : "rgb(100, 100, 100)";
		c.beginPath();
		c.moveTo(0 - 5 - 4, 0 + 4);
		c.lineTo(0 + 5 + 4, 0 + 4);
		c.lineTo(0 + 25, 0 + 20);
		c.lineTo(0 - 25, 0 + 20);
		c.fill();
		/* beaker body */
		c.strokeStyle = (this.bought) ? "rgb(0, 0, 0)" : "rgb(100, 100, 100)";
		c.beginPath();
		c.moveTo(0 - 5, 0 - 20);
		c.lineTo(0 - 5, 0);
		c.lineTo(0 - 5 - 20, 0 + 20);
		c.lineTo(0 + 25, 0 + 20);
		c.lineTo(0 + 5, 0);
		c.lineTo(0 + 5, 0 - 20);
		c.stroke();
		/* beaker opening */
		c.beginPath();
		c.arc(0, 0 - 27, 10, 0, 2 * Math.PI);
		c.stroke();
	}
	else if(this.name === "Talisman of Intangibility") {
		c.fillStyle = "rgb(100, 100, 100)";
		c.beginPath();
		c.arc(0, 0, 30, 0, 2 * Math.PI);
		c.fill();
		/* gemstone */
		c.fillStyle = (this.bought) ? "#000080" : "rgb(200, 200, 200)";
		c.beginPath();
		c.moveTo(0 - 6, 0 - 12);
		c.lineTo(0 + 6, 0 - 12);
		c.lineTo(0 + 15, 0);
		c.lineTo(0 + 6, 0 + 12);
		c.lineTo(0 - 6, 0 + 12);
		c.lineTo(0 - 15, 0);
		c.lineTo(0 - 6, 0 - 12);
		c.fill();
		/* necklace threads */
		c.strokeStyle = (this.bought) ? "rgb(138, 87, 0)" : "rgb(100, 100, 100)";
		c.beginPath();
		c.moveTo(0 - 5, 0 - 29);
		c.lineTo(0 - 15, 0 - 75);
		c.stroke();
		c.beginPath();
		c.moveTo(0 + 5, 0 - 29);
		c.lineTo(0 + 15, 0 - 75);
		c.stroke();
	}
	else if(this.name === "Skull of Reanimation") {
		c.fillStyle = (this.bought) ? "#FFFFFF" : "rgb(100, 100, 100)";
		/* skull */
		c.beginPath();
		c.arc(0, 0, 30, 0, 2 * Math.PI);
		c.fill();
		/* skull chin */
		c.fillRect(0 - 15, 0 + 20, 30, 20);
		/* eyes - whitespace */
		c.fillStyle = "rgb(200, 200, 200)";
		c.beginPath();
		c.arc(0 - 13, 0 - 10, 7, 0, 2 * Math.PI);
		c.arc(0 + 13, 0 - 10, 7, 0, 2 * Math.PI);
		c.fill();
		/* mouth */
		c.fillRect(0 - 2, 0 + 20, 4, 20);
		c.fillRect(0 - 10, 0 + 20, 4, 20);
		c.fillRect(0 + 6, 0 + 20, 4, 20);
	}
	else if(this.name === "Box of Storage") {
		c.fillStyle = (this.bought) ? "rgb(138, 87, 0)" : "rgb(100, 100, 100)";
		/* front face */
		c.beginPath();
		c.fillRect(0 - 30, 0 - 10, 40, 40);
		c.fill();
		/* top face */
		c.beginPath();
		c.moveTo(0 - 30, 0 - 12);
		c.lineTo(0 + 10, 0 - 12);
		c.lineTo(0 + 40, 0 - 40);
		c.lineTo(0, 0 - 40);
		c.fill();
		/* right face */
		c.beginPath();
		c.moveTo(0 + 12, 0 - 10);
		c.lineTo(0 + 12, 0 + 30);
		c.lineTo(0 + 42, 0);
		c.lineTo(0 + 42, 0 - 40);
		c.fill();
		/* lines separating lid from box - whitespace */
		c.strokeStyle = "rgb(200, 200, 200)";
		c.lineWidth = 2;
		c.beginPath();
		c.moveTo(0 - 30, 0 - 5);
		c.lineTo(0 + 10, 0 - 5);
		c.stroke();
		c.beginPath();
		c.moveTo(0 + 10, 0 - 3);
		c.lineTo(0 + 42, 0 - 35);
		c.stroke();
		c.lineWidth = 5;
	}
	c.restore();
	this.mouseOver = false;
	if(Math.dist(input.mouse.x, input.mouse.y, this.x, this.y) <= 75) {
		this.mouseOver = true;
	}
	if(this.x >= 500 && this.infoOp > 0 && input.mouse.x > this.x - 335 && input.mouse.x < this.x - 85 && input.mouse.y > this.y - 100 && input.mouse.y < this.y + 100) {
		this.mouseOver = true;
	}
	if(this.x <= 500 && this.infoOp > 0 && input.mouse.x > this.x + 85 && input.mouse.x < this.x + 335 && input.mouse.y > this.y - 100 && input.mouse.y < this.y + 100) {
		this.mouseOver = true;
	}
	if(this.x <= 500 && this.infoOp > 0 && input.mouse.x > this.x && input.mouse.x < this.x + 100 && input.mouse.y > this.y - 75 && input.mouse.y < this.y + 75) {
		this.mouseOver = true;
	}
	if(this.x >= 500 && this.infoOp > 0 && input.mouse.x < this.x && input.mouse.x > this.x - 100 && input.mouse.y > this.y - 75 && input.mouse.y < this.y + 75) {
		this.mouseOver = true;
	}
	/* prevent conflicts between shop items when mousing over */
	if(this.name === "Boots of Speediness" && (coinDoubler.infoOp > 0 || doubleJumper.infoOp > 0)) {
		this.mouseOver = false;
	}
	if(this.name === "Potion of Jumpiness" && (speedIncreaser.infoOp > 0 || coinDoubler.infoOp > 0)) {
		this.mouseOver = false;
	}
	if(this.name === "Skull of Reanimation" && (intangibilityTalisman.infoOp > 0 || secondItem.infoOp > 0)) {
		this.mouseOver = false;
	}
	if(this.name === "Piggy Bank of Money" && doubleJumper.infoOp > 0) {
		this.mouseOver = false;
	}
	if(this.name === "Box of Storage" && (secondLife.infoOp > 0 || intangibilityTalisman.infoOp > 0)) {
		this.mouseOver = false;
	}
	if(this.name === "Talisman of Intangibility" && secondItem.infoOp > 0) {
		this.mouseOver = false;
	}
	if(this.mouseOver) {
		this.infoOp = (this.infoOp < 1) ? this.infoOp + 0.1 : 1;
	}
	else {
		this.infoOp = (this.infoOp > 0) ? this.infoOp - 0.1 : 0;
	}
	c.restore();
};
ShopItem.prototype.displayInfo = function() {
	c.globalAlpha = (this.infoOp > 0) ? this.infoOp : 0;
	if(this.name !== "Potion of Jumpiness" && this.name !== "Box of Storage") {
		c.fillStyle = "rgb(100, 100, 100)";
		c.beginPath();
		c.moveTo(this.x + 75, this.y);
		c.lineTo(this.x + 85, this.y + 10);
		c.lineTo(this.x + 85, this.y - 10);
		c.fill();
		c.fillRect(this.x + 85, this.y - 100, 250, 200);
		/* title */
		c.fillStyle = "rgb(200, 200, 200)";
		c.font = "20px monospace";
		c.textAlign = "left";
		if(this.name === "Talisman of Intangibility") {
			c.font = "17px monospace";
		}
		c.fillText(this.name, this.x + 95, this.y - 80);
		c.font = "20px monospace";
		/* line */
		c.strokeStyle = "rgb(200, 200, 200)";
		c.beginPath();
		c.moveTo(this.x + 90, this.y - 70);
		c.lineTo(this.x + 330, this.y - 70);
		c.stroke();
		/* description - manual line break insertion */
		switch(this.name) {
			case "Piggy Bank of Money":
				c.fillText("With this amazing", this.x + 95, this.y - 50);
				c.fillText("piggy bank, twice as", this.x + 95, this.y - 30);
				c.fillText("many coins will", this.x + 95, this.y - 10);
				c.fillText("appear in game.", this.x + 95, this.y + 10);
				break;
			case "Boots of Speediness":
				c.fillText("These speedy boots", this.x + 95, this.y - 50);
				c.fillText("make you run twice", this.x + 95, this.y - 30);
				c.fillText("as fast.", this.x + 95, this.y - 10);
				break;
			case "Talisman of Intangibility":
				c.fillText("Walk through", this.x + 95, this.y - 50);
				c.fillText("everything with this", this.x + 95, this.y - 30);
				c.fillText("magical talisman.", this.x + 95, this.y - 10);
				c.fillText("Press [down] to use.", this.x + 95, this.y + 10);
				break;
			case "Skull of Reanimation":
				c.fillText("Come back from the", this.x + 95, this.y - 50);
				c.fillText("dead! This ancient", this.x + 95, this.y - 30);
				c.fillText("skull grants you an", this.x + 95, this.y - 10);
				c.fillText("extra life each game.", this.x + 95, this.y + 10);
				break;
		}
		/* button 1 */
		if(this.upgrades < 2) {
			c.strokeRect(this.x + 95, this.y + 60, 230, 30);
		}
		c.textAlign = "center";
		if(!this.bought) {
			c.fillText("Buy - $" + this.price, this.x + 210, this.y + 80);
		}
		else if(this.upgrades < 2) {
			c.fillText("Upgrade - $" + this.price, this.x + 210, this.y + 80);
		}
		else if(this.upgrades >= 2) {
			c.fillText("Fully upgraded", this.x + 210, this.y + 80);
		}
		if(input.mouse.x > this.x + 95 && input.mouse.x < this.x + 325 && input.mouse.y > this.y + 60 && input.mouse.y < this.y + 90 && input.mouse.pressed && !utilities.pastInputs.mouse.pressed && this.infoOp >= 1  && this.x < 500 && this.infoOp > 0) {
			if(this.upgrades < 2) {
				if(p.totalCoins > this.price) {
					if(!this.bought) {
						this.bought = true;
						this.price = 10; // all of the items first upgrade costs 10
					}
					else {
						this.showingPopup = true;
					}
					p.totalCoins -= this.price;
				}
			}
		}
		/* button 2 */
		if(this.bought) {
			c.strokeRect(this.x + 95, this.y + 20, 230, 30);
			c.textAlign = "center";
			c.fillText((this.equipped) ? "Unequip" : "Equip", this.x + 210, this.y + 40);
			if(input.mouse.x > this.x + 95 && input.mouse.x < this.x + 325 && input.mouse.y > this.y + 20 && input.mouse.y < this.y + 50 && input.mouse.pressed && !utilities.pastInputs.mouse.pressed && this.infoOp > 0) {
				if(!this.equipped) {
					if(p.itemsEquipped < 1) {
						this.equipped = true;
						p.itemsEquipped ++;
					}
				}
				else {
					this.equipped = false;
					p.itemsEquipped --;
				}
			}
		}
	}
	else {
		c.fillStyle = "rgb(100, 100, 100)";
		c.beginPath();
		c.moveTo(this.x - 75, this.y);
		c.lineTo(this.x - 85, this.y + 10);
		c.lineTo(this.x - 85, this.y - 10);
		c.fill();
		c.fillRect(this.x - 335, this.y - 100, 250, 200);
		/* title */
		c.fillStyle = "rgb(200, 200, 200)";
		c.font = "20px monospace";
		c.textAlign = "left";
		c.fillText(this.name, this.x - 325, this.y - 80);
		c.font = "20px monospace";
		/* line */
		c.strokeStyle = "rgb(200, 200, 200)";
		c.beginPath();
		c.moveTo(this.x - 90, this.y - 70);
		c.lineTo(this.x - 330, this.y - 70);
		c.stroke();
		/* description */
		switch(this.name) {
			case "Box of Storage":
				c.fillText("Are your hands full?", this.x - 325, this.y - 50);
				c.fillText("Carry an extra item", this.x - 325, this.y - 30);
				c.fillText("from the shop with", this.x - 325, this.y - 10);
				c.fillText("you each game.", this.x - 325, this.y + 10);
				break;
			case "Potion of Jumpiness":
				c.fillText("Drink this potion to", this.x - 325, this.y - 50);
				c.fillText("be able to double", this.x - 325, this.y - 30);
				c.fillText("jump!", this.x - 325, this.y - 10);
		}
		/* button 1 */
		c.textAlign = "center";
		if(this.bought && this.name !== "Box of Storage") {
			c.strokeRect(this.x - 325, this.y + 20, 230, 30);
			c.fillText((this.equipped) ? "Unequip" : "Equip", this.x - 210, this.y + 40);
		}
		if(input.mouse.x > this.x - 325 && input.mouse.x < this.x - 95 && input.mouse.y > this.y + 20 && input.mouse.y < this.y + 50 && this.bought && input.mouse.pressed && !utilities.pastInputs.mouse.pressed && this.infoOp > 0 && this.name !== "Box of Storage") {
			if(!this.equipped) {
				if(p.itemsEquipped < 1) {
					this.equipped = true;
					p.itemsEquipped ++;
				}
			}
			else {
				this.equipped = false;
				p.itemsEquipped --;
			}
		}
		/* button 2 */
		if(this.name !== "Box of Storage" || !this.bought) {
			if(this.upgrades < 2) {
				c.strokeRect(this.x - 325, this.y + 60, 230, 30);
			}
			if(!this.bought) {
				c.fillText("Buy - $" + this.price, this.x - 210, this.y + 80);
			}
			else if(this.upgrades < 2) {
				c.fillText("Upgrade - $" + this.price, this.x - 210, this.y + 80);
			}
			else {
				c.fillText("Fully Upgraded", this.x - 210, this.y + 80);
			}
			if(input.mouse.x > this.x - 325 && input.mouse.x < this.x - 95 && input.mouse.y > this.y + 60 && input.mouse.y < this.y + 90 && input.mouse.pressed && !utilities.pastInputs.mouse.pressed && p.totalCoins >= this.price && this.upgrades < 2 && this.infoOp > 0) {
				p.totalCoins -= this.price;
				if(!this.bought) {
					this.bought = true;
					if(this.name === "Box of Storage") {
						p.itemsEquipped --;
					}
				}
				else {
					this.showingPopup = true;
				}
			}
		}
	}
	c.globalAlpha = 1;
};
ShopItem.prototype.displayPopup = function() {
	if(this.showingPopup) {
		coinDoubler.infoOp = -0.5;
		speedIncreaser.infoOp = -0.5;
		doubleJumper.infoOp = -0.5;
		intangibilityTalisman.infoOp = -0.5;
		secondLife.infoOp = -0.5;
		secondItem.infoOp = -0.5;
		c.fillStyle = "rgb(100, 100, 100)";
		c.fillRect(250, 250, 300, 300);
		/* title */
		c.fillStyle = "rgb(200, 200, 200)";
		c.textAlign = "left";
		c.fillText("Upgrade Item", 260, 270);
		/* line */
		c.beginPath();
		c.strokeStyle = "rgb(200, 200, 200)";
		c.moveTo(260, 280);
		c.lineTo(540, 280);
		c.stroke();
		/* upgrade description */
		switch(this.name) {
			case "Piggy Bank of Money":
				if(this.upgrades === 0) {
					c.fillText("Current Level:", 260, 300);
					c.fillText("● 2x coin multiplier", 260, 320);
					c.fillText("Upgraded Level:", 260, 360);
					c.fillText("● 2x coin multiplier", 260, 380);
					c.fillText("● Weak coin magnet", 260, 400);
				}
				if(this.upgrades === 1) {
					c.fillText("Current Level:", 260, 300);
					c.fillText("● 2x coin multiplier", 260, 320);
					c.fillText("● Weak coin magnet", 260, 340);
					c.fillText("Upgraded Level:", 260, 380);
					c.fillText("● 2x coin multiplier", 260, 400);
					c.fillText("● Strong coin magnet", 260, 420);
				}
				break;
			case "Boots of Speediness":
				if(this.upgrades === 0) {
					c.fillText("Current Level:", 260, 300);
					c.fillText("● 1.5x max speed", 260, 320);
					c.fillText("Upgraded Level:", 260, 360);
					c.fillText("● 1.5x max speed", 260, 380);
					c.fillText("● 2x acceleration", 260, 400);
				}
				if(this.upgrades === 1) {
					c.fillText("Current Level:", 260, 300);
					c.fillText("● 1.5x max speed", 260, 320);
					c.fillText("● 2x acceleration", 260, 340);
					c.fillText("Upgraded Level:", 260, 380);
					c.fillText("● 2x max speed", 260, 400);
					c.fillText("● 2x acceleration", 260, 420);
				}
				break;
			case"Potion of Jumpiness":
				if(this.upgrades === 0) {
					c.fillText("Current Level:", 260, 300);
					c.fillText("● High jumping", 260, 320);
					c.fillText("Upgraded Level:", 260, 360);
					c.fillText("● High jumping", 260, 380);
					c.fillText("● Low double jumping", 260, 400);
				}
				else if(this.upgrades === 1) {
					c.fillText("Current Level:", 260, 300);
					c.fillText("● High jumping", 260, 320);
					c.fillText("● Low double jumping", 260, 340);
					c.fillText("Upgraded Level:", 260, 380);
					c.fillText("● High jumping", 260, 400);
					c.fillText("● High double jumping", 260, 420);
				}
				break;
			case "Talisman of Intangibility":
				if(this.upgrades === 0) {
					c.fillText("Current Level:", 260, 300);
					c.fillText("● Intangibility", 260, 320);
					c.fillText("Upgraded Level:", 260, 360);
					c.fillText("● Intangibility", 260, 380);
					c.fillText("● Screen edge wrap", 260, 400);
				}
				if(this.upgrades === 1) {
					c.fillText("Current Level:", 260, 300);
					c.fillText("● Intangibility", 260, 320);
					c.fillText("● Screen edge wrap", 260, 340);
					c.fillText("Upgraded Level:", 260, 380);
					c.fillText("● Intangibility", 260, 400);
					c.fillText("● Screen edge wrap", 260, 420);
					c.fillText("● Coin intangibility", 260, 440);
					c.fillText("exception", 260, 460);
				}
				break;
			case "Skull of Reanimation":
				if(this.upgrades === 0) {
					c.fillText("Current Level:", 260, 300);
					c.fillText("● 1 extra life", 260, 320);
					c.fillText("● Short invincibility", 260, 340);
					c.fillText("time after revival", 260, 360);
					c.fillText("Upgraded Level:", 260, 400);
					c.fillText("● 1 extra life", 260, 420);
					c.fillText("● Long invincibility", 260, 440);
					c.fillText("time after revival", 260, 460);
				}
				else if(this.upgrades === 1) {
					c.fillText("Current Level:", 260, 300);
					c.fillText("● 1 extra life", 260, 320);
					c.fillText("● Long invincibility", 260, 340);
					c.fillText("time after revival", 260, 360);
					c.fillText("Upgraded Level:", 260, 400);
					c.fillText("● 2 extra lives", 260, 420);
					c.fillText("● Long invincibility", 260, 440);
					c.fillText("time after revival", 260, 460);
				}
				break;
		}
		/* button 1 */
		c.strokeRect(260, 470, 280, 30);
		c.textAlign = "center";
		c.fillText("Close", 400, 490);
		if(input.mouse.x > 260 && input.mouse.x < 540 && input.mouse.y > 470 && input.mouse.y < 500 && input.mouse.pressed && !utilities.pastInputs.mouse.pressed) {
			this.showingPopup = false;
		}
		/* button 2 */
		c.strokeRect(260, 510, 280, 30);
		c.fillText("Upgrade - $" + this.price, 400, 530);
		if(input.mouse.x > 260 && input.mouse.x < 540 && input.mouse.y > 510 && input.mouse.y < 540 && input.mouse.pressed && !utilities.pastInputs.mouse.pressed) {
			if(p.totalCoins > this.price) {
				p.totalCoins -= this.price;
				this.upgrades ++;
				this.showingPopup = false;
				if(this.name === "Piggy Bank of Money" || this.name === "Skull of Reanimation" || this.name === "Talisman of Intangibility") {
					this.price = 15;
				}
			}
		}
	}
};
var coinDoubler = new ShopItem(800 / 4, 800 / 3, "Piggy Bank of Money", "With this amazing piggy bank, twice as many coins will appear in game.", 5);
var speedIncreaser = new ShopItem(800 / 4 * 2, 800 / 3, "Boots of Speediness", "These speedy boots make you run extremely fast.", 10);
var doubleJumper = new ShopItem(800 / 4 * 3, 800 / 3, "Potion of Jumpiness", "Drink this potion to be able to jump higher and double jump!", 10);
var intangibilityTalisman = new ShopItem(800 / 4, 800 / 3 * 2, "Talisman of Intangibility", "Walk through walls, floors, and enemies with this magical talisman. Press down to use.", 10);
var secondLife = new ShopItem(800 / 4 * 2, 800 / 3 * 2, "Skull of Reanimation", "Come back from the dead! This ancient skull grants you extra lives each game.", 15);
var secondItem = new ShopItem(800 / 4 * 3, 800 / 3 * 2, "Box of Storage", "Are your hands full? Carry an extra shop item with you each run.", 15);

function Achievement(x, y, name) {
	this.x = x;
	this.y = y;
	this.name = name;
	this.infoOp = 0;
	this.progress = 0;
};
Achievement.prototype.displayLogo = function() {
	/* background circle */
	c.fillStyle = "rgb(200, 200, 200)";
	c.strokeStyle = "rgb(100, 100, 100)";
	c.beginPath();
	c.arc(this.x, this.y, 50, 0, 2 * Math.PI);
	c.fill();
	c.stroke();
	if(this.name === "I Survived") {
		/* rays of light */
		for(var r = 0; r < 2 * Math.PI; r += 2 * Math.PI / 6) {
			c.fillStyle = (this.progress === 100) ? "rgb(255, 128, 0)" : "rgb(200, 200, 200)";
			c.save();
			c.translate(this.x, this.y);
			c.rotate(r);
			c.beginPath();
			c.arc(0, 0, 47, -0.2, 0.2);
			c.lineTo(0, 0);
			c.fill();
			c.restore();
		}
		/* stickman */
		c.beginPath();
		c.strokeStyle = (this.progress === 100) ? "rgb(0, 0, 0)" : "rgb(100, 100, 100)";
		c.moveTo(this.x - 20, this.y + 25);
		c.lineTo(this.x - 20, this.y + 10);
		c.lineTo(this.x + 20, this.y + 10);
		c.lineTo(this.x + 20, this.y + 25);
		c.moveTo(this.x, this.y + 10);
		c.lineTo(this.x, this.y - 10);
		c.moveTo(this.x - 20, this.y - 30);
		c.lineTo(this.x - 20, this.y - 10);
		c.lineTo(this.x + 20, this.y - 10);
		c.lineTo(this.x + 20, this.y - 30);
		c.stroke();
		c.fillStyle = (this.progress === 100) ? "rgb(0, 0, 0)" : "rgb(100, 100, 100)";
		c.beginPath();
		c.arc(this.x, this.y - 17, 10, 0, 2 * Math.PI);
		c.fill();
	}
	else if(this.name === "Survivalist") {
		c.fillStyle = (this.progress === 100) ? "rgb(255, 0, 0)" : "rgb(100, 100, 100)";
		c.beginPath();
		c.moveTo(this.x - 30, this.y);
		c.lineTo(this.x + 30, this.y);
		c.lineTo(this.x, this.y + 30);
		c.fill();
		c.beginPath();
		c.arc(this.x - 15, this.y, 15, Math.PI, 2 * Math.PI);
		c.fill();
		c.beginPath();
		c.arc(this.x + 15, this.y, 15, Math.PI, 2 * Math.PI);
		c.fill();
	}
	else if(this.name === "Extreme Survivalist") {
		/* left heart */
		c.save();
		c.translate(this.x - 20, this.y);
		c.scale(0.5, 0.5);
		c.fillStyle = (this.progress === 100) ? "rgb(255, 0, 0)" : "rgb(100, 100, 100)";
		c.beginPath();
		c.moveTo(-30, 0);
		c.lineTo(30, 0);
		c.lineTo(0, 30);
		c.fill();
		c.beginPath();
		c.arc(-15, 0, 15, Math.PI, 2 * Math.PI);
		c.fill();
		c.beginPath();
		c.arc(15, 0, 15, Math.PI, 2 * Math.PI);
		c.fill();
		c.restore();
		/* right heart */
		c.save();
		c.translate(this.x + 20, this.y);
		c.scale(0.5, 0.5);
		c.fillStyle = (this.progress === 100) ? "rgb(255, 0, 0)" : "rgb(100, 100, 100)";
		c.beginPath();
		c.moveTo(-30, 0);
		c.lineTo(30, 0);
		c.lineTo(0, 30);
		c.fill();
		c.beginPath();
		c.arc(-15, 0, 15, Math.PI, 2 * Math.PI);
		c.fill();
		c.beginPath();
		c.arc(15, 0, 15, Math.PI, 2 * Math.PI);
		c.fill();
		c.restore();
	}
	else if(this.name === "What are the Odds") {
		/* front face */
		c.fillStyle = (this.progress === 100) ? "" : "rgb(100, 100, 100)";
		c.fillRect(this.x - 20 - 6, this.y - 10 + 6, 30, 30);
		/* top face */
		c.beginPath();
		c.moveTo(this.x - 20 - 6, this.y - 12 + 6);
		c.lineTo(this.x + 10 - 6, this.y - 12 + 6);
		c.lineTo(this.x + 30 - 6, this.y - 32 + 6);
		c.lineTo(this.x + 0 - 6, this.y - 32 + 6);
		c.fill();
		/* right face */
		c.beginPath();
		c.moveTo(this.x + 12 - 6, this.y - 10 + 6);
		c.lineTo(this.x + 12 - 6, this.y + 20 + 6);
		c.lineTo(this.x + 32 - 6, this.y + 6);
		c.lineTo(this.x + 32 - 6, this.y - 30 + 6);
		c.fill();
		/* die 1 - whitespace */
		c.fillStyle = "rgb(200, 200, 200)";
		c.save();
		c.translate(this.x  - 1, this.y - 15);
		c.scale(1, 0.75);
		c.beginPath();
		c.arc(0, 0, 5, 0, 2 * Math.PI);
		c.fill();
		c.restore();
		/* die 2 - whitespace */
		c.save();
		c.translate(this.x + 12, this.y - 3);
		c.scale(0.75, 1);
		c.beginPath();
		c.arc(0, 0, 5, 0, 2 * Math.PI);
		c.fill();
		c.restore();
		c.save();
		c.translate(this.x + 21, this.y + 3);
		c.scale(0.75, 1);
		c.beginPath();
		c.arc(0, 0, 5, 0, 2 * Math.PI);
		c.fill();
		c.restore();
		/* die 3 - whitespace */
		c.beginPath();
		c.arc(this.x - 21, this.y + 4, 5, 0, 2 * Math.PI);
		c.fill();
		c.beginPath();
		c.arc(this.x - 1, this.y + 18, 5, 0, 2 * Math.PI);
		c.fill();
		c.arc(this.x - 10, this.y + 11, 5, 0, 2 * Math.PI);
		c.fill();

	}
	else if(this.name === "Moneybags") {
		c.fillStyle = (this.progress === 100) ? "rgb(255, 255, 0)" : "rgb(100, 100, 100)";
		c.font = "bold 40px monospace";
		c.textAlign = "center";
		c.fillText("$", this.x, this.y + 12);
	}
	else if(this.name === "Extreme Moneybags") {
		c.fillStyle = (this.progress === 100) ? "rgb(255, 255, 0)" : "rgb(100, 100, 100)";
		c.font = "bold 40px monospace";
		c.textAlign = "center";
		c.fillText("$$", this.x, this.y + 12);
	}
	else if(this.name === "Improvement") {
		c.fillStyle = (this.progress === 100) ? "rgb(0, 128, 0)" : "rgb(100, 100, 100)";
		c.font = "bold 50px monospace";
		c.textAlign = "center";
		c.fillText("+", this.x, this.y + 12);
	}
	else if(this.name === "Places to Be") {
		c.lineWidth = 2;
		c.setLineDash([2, 2]);
		c.beginPath();
		c.moveTo(this.x, this.y - 10);
		c.lineTo(this.x, this.y + 10);
		c.lineTo(this.x + 10, this.y + 20);
		c.moveTo(this.x, this.y + 10);
		c.lineTo(this.x - 10, this.y + 20);
		c.moveTo(this.x, this.y - 10);
		c.lineTo(this.x + 10, this.y);
		c.moveTo(this.x, this.y - 10);
		c.lineTo(this.x - 10, this.y);
		c.stroke();
		c.beginPath();
		c.arc(this.x, this.y - 15, 5, 0, 2 * Math.PI);
		c.stroke();
		c.setLineDash([]);
		c.lineWidth = 5;
	}
	else if(this.name === "Ghost") {
		c.save();
		c.translate(0, 5);
		c.fillStyle = (this.progress === 100) ? "rgb(255, 255, 255)" : "rgb(100, 100, 100)";
		c.fillRect(this.x - 15, this.y - 15, 30, 30);
		c.beginPath();
		c.arc(this.x, this.y - 15, 15, Math.PI, 2 * Math.PI);
		c.fill();
		/* wavy bits */
		c.beginPath();
		c.arc(this.x - 12, this.y + 15, 3, 0, Math.PI);
		c.fill();
		c.beginPath();
		c.arc(this.x, this.y + 15, 3, 0, Math.PI);
		c.fill();
		c.beginPath();
		c.arc(this.x + 12, this.y + 15, 3, 0, Math.PI);
		c.fill();
		/* wavy bits - whitespace */
		c.fillStyle = "rgb(200, 200, 200)";
		c.beginPath();
		c.arc(this.x - 6, this.y + 15, 3, Math.PI, 2 * Math.PI);
		c.fill();
		c.beginPath();
		c.arc(this.x + 6, this.y + 15, 3, Math.PI, 2 * Math.PI);
		c.fill();
		/* eyes - whitespace */
		c.beginPath();
		c.arc(this.x - 7, this.y - 10, 5, 0, 2 * Math.PI);
		c.fill();
		c.beginPath();
		c.arc(this.x + 7, this.y - 10, 5, 0, 2 * Math.PI);
		c.fill();
		c.restore();
	}
};
Achievement.prototype.displayInfo = function() {
	c.globalAlpha = (this.infoOp > 0) ? this.infoOp : 0;
	if(this.x < 450) {
		/* info box */
		c.fillStyle = "rgb(100, 100, 100)";
		c.beginPath();
		c.moveTo(this.x + 50, this.y);
		c.lineTo(this.x + 60, this.y - 10);
		c.lineTo(this.x + 60, this.y + 10);
		c.fill();
		c.fillRect(this.x + 60, this.y - 100, 250, 200);
		/* title */
		c.fillStyle = "rgb(200, 200, 200)";
		c.font = "20px monospace";
		c.textAlign = "left";
		c.fillText(this.name, this.x + 70, this.y - 80);
		/* line */
		c.strokeStyle = "rgb(200, 200, 200)";
		c.beginPath();
		c.moveTo(this.x + 65, this.y - 70);
		c.lineTo(this.x + 305, this.y - 70);
		c.stroke();
		/* description */
		switch(this.name) {
			case "I Survived":
				c.fillText("Survive all of the", this.x + 70, this.y - 50);
				c.fillText("events.", this.x + 70, this.y - 30);
				break;
			case "Survivalist":
				c.fillText("Achieve a score of", this.x + 70, this.y - 50);
				c.fillText("10 points or higher.", this.x + 70, this.y - 30);
				break;
			case "What are the Odds":
				c.fillText("Experience the same", this.x + 70, this.y - 50);
				c.fillText("event twice in a", this.x + 70, this.y - 30);
				c.fillText("row.", this.x + 70, this.y - 10);
				break;
			case "Moneybags":
				c.fillText("Buy something from", this.x + 70, this.y - 50);
				c.fillText("the shop.", this.x + 70, this.y - 30);
				break;
			case "Improvement":
				c.fillText("Beat your record", this.x + 70, this.y - 50);
				c.fillText("5 times.", this.x + 70, this.y - 30);
				break;
			case "Places to Be":
				c.fillText("[???]", this.x + 70, this.y - 50);
				break;
		}
		/* progress */
		c.strokeRect(this.x + 70, this.y + 60, 230, 30);
		if(this.progress === 100) {
			c.textAlign = "center";
			c.fillText("Achieved", this.x + 175, this.y + 80);
			c.textAlign = "left";
		}
		else {
			c.textAlign = "center";
			c.fillText("Progress: " + this.progress + "%", this.x + 175, this.y + 80);
			c.textAlign = "left";
		}
	}
	else {
		/* info box */
		c.fillStyle = "rgb(100, 100, 100)";
		c.beginPath();
		c.moveTo(this.x - 50, this.y);
		c.lineTo(this.x - 60, this.y - 10);
		c.lineTo(this.x - 60, this.y + 10);
		c.fill();
		c.fillRect(this.x - 310, this.y - 100, 250, 200);
		/* title */
		c.fillStyle = "rgb(200, 200, 200)";
		c.font = "20px monospace";
		c.textAlign = "left";
		c.fillText(this.name, this.x - 300, this.y - 80);
		/* line */
		c.strokeStyle = "rgb(200, 200, 200)";
		c.beginPath();
		c.moveTo(this.x - 65, this.y - 70);
		c.lineTo(this.x - 305, this.y - 70);
		c.stroke();
		/* description */
		switch(this.name) {
			case "Extreme Survivalist":
				c.fillText("Achieve a score of", this.x - 300, this.y - 50);
				c.fillText("20 points or higher.", this.x - 300, this.y - 30);
				break;
			case "Extreme Moneybags":
				c.fillText("Buy everything in", this.x - 300, this.y - 50);
				c.fillText("the shop.", this.x - 300, this.y - 30);
				break;
			case "Ghost":
				c.fillText("[???]", this.x - 300, this.y - 50);
		}
		/* progress */
		c.strokeRect(this.x - 300, this.y + 60, 230, 30);
		if(this.progress === 100) {
			c.textAlign = "center";
			c.fillText("Achieved", this.x - 175, this.y + 80);
			c.textAlign = "left";
		}
		else {
			c.textAlign = "center";
			c.fillText("Progress: " + this.progress + "%", this.x - 175, this.y + 80);
			c.textAlign = "left";
		}
	}
	c.globalAlpha = 1;
	/* fading in */
	if(Math.dist(this.x, this.y, input.mouse.x, input.mouse.y) <= 50) {
		this.infoOp = (this.infoOp < 1) ? this.infoOp + 0.1 : 1;
	}
	else {
		this.infoOp = (this.infoOp > 0) ? this.infoOp - 0.1 : 0;
	}
};
Achievement.prototype.checkProgress = function() {
	switch(this.name) {
		case "I Survived":
			this.progress = (p.eventsSurvived.length / game.events.length) * 100;
			break;
		case "Survivalist":
			var theHighscore = p.score > p.highScore ? p.score : p.highScore;
			this.progress = theHighscore * 10;
			this.progress = this.progress > 100 ? 100 : this.progress;
			break;
		case "Extreme Survivalist":
			var theHighscore = p.score > p.highScore ? p.score : p.highScore;
			this.progress = theHighscore * 5;
			this.progress = this.progress > 100 ? 100 : this.progress;
			break;
		case "What are the Odds":
			this.progress = (p.repeatedEvent) ? 100 : 0;
			break;
		case "Moneybags":
			if(coinDoubler.bought || speedIncreaser.bought || doubleJumper.bought || intangibilityTalisman.bought || secondLife.bought || secondItem.bought) {
				this.progress = 100;
			}
			else {
				this.progress = 0;
			}
			break;
		case "Extreme Moneybags":
			this.progress = 0;
			if(coinDoubler.bought) {
				this.progress += 100 / 6;
			}
			if(speedIncreaser.bought) {
				this.progress += 100 / 6;
			}
			if(doubleJumper.bought) {
				this.progress += 100 / 6;
			}
			if(intangibilityTalisman.bought) {
				this.progress += 100 / 6;
			}
			if(secondLife.bought) {
				this.progress += 100 / 6;
			}
			if(secondItem.bought) {
				this.progress += 100 / 6;
			}
			break;
		case "Improvement":
			this.progress = p.numRecords * 20;
			break;
		case "Places to Be":
			this.progress = p.gonePlaces ? 100 : 0;
			break;
		case "Ghost":
			this.progress = p.beenGhost ? 100 : 0;
			break;
	}
	this.progress = Math.ceil(this.progress * 10) / 10;
	this.progress = Math.min(this.progress, 100);
	if(this.progress >= 100 && this.previousProgress < 100) {
		game.chatMessages.push(new ChatMessage("Achievement Earned: " + this.name, "rgb(255, 255, 0)"));
	}
	this.previousProgress = this.progress;
}
var achievement1 = new Achievement(200, 200, "I Survived");
var achievement2 = new Achievement(400, 200, "Survivalist");
var achievement3 = new Achievement(600, 200, "Extreme Survivalist");
var achievement4 = new Achievement(200, 400, "What are the Odds");
var achievement5 = new Achievement(400, 400, "Moneybags");
var achievement6 = new Achievement(600, 400, "Extreme Moneybags");
var achievement7 = new Achievement(200, 600,  "Improvement");
var achievement8 = new Achievement(400, 600, "Places to Be");
var achievement9 = new Achievement(600, 600, "Ghost");

function Coin(x, y, timeToAppear) {
	this.x = x;
	this.y = y;
	this.spin = -1;
	this.spinDir = 0.05;
	this.timeToAppear = timeToAppear || 0;
	this.age = 0;
};
Coin.prototype.display = function() {
	if(this.age > this.timeToAppear) {
		c.fillStyle = "rgb(255, 255, 0)";
		c.save();
		c.translate(this.x, this.y + p.worldY);
		c.scale(this.spin, 1);
		c.beginPath();
		c.arc(0, 0, 20, 0, 2 * Math.PI);
		c.fill();
		c.restore();
	}
};
Coin.prototype.update = function() {
	this.spin += this.spinDir;
	if(this.spin > 1) {
		this.spinDir = -0.05;
	}
	else if(this.spin < -1) {
		this.spinDir = 0.05;
	}
	this.age ++;
	if(p.x + 5 > this.x - 20 && p.x - 5 < this.x + 20 && p.y + 46 > this.y + p.worldY - 20 && p.y < this.y + 20 + p.worldY && this.age > this.timeToAppear && !(intangibilityTalisman.equipped && input.keys[40] && intangibilityTalisman.upgrades < 2)) {
		this.splicing = true;
		p.coins += (coinDoubler.equipped) ? 2 : 1;
	}
	if(coinDoubler.equipped && coinDoubler.upgrades === 1 && Math.dist(this.x, this.y, p.x, p.y) < 200 && this.age > this.timeToAppear) {
		this.x += (p.x - this.x) / 10;
		this.y += (p.y - this.y) / 10;
	}
	if(coinDoubler.equipped && coinDoubler.upgrades === 2 && this.age > this.timeToAppear) {
		this.x += (p.x - this.x) / 10;
		this.y += (p.y - this.y) / 10;
	}
};
function ChatMessage(msg, col) {
	this.msg = msg;
	this.col = col;
	this.time = 120;
};
ChatMessage.prototype.display = function(y) {
	c.fillStyle = this.col;
	c.textAlign = "right";
	c.font = "20px monospace";
	c.fillText(this.msg, 790, y);
	this.time --;
};
/* laser event */
function Explosion(x, y) {
	this.x = x;
	this.y = y;
	this.size = 0;
	this.width = 10;
	this.opacity = 1;
};
Explosion.prototype.display = function() {
	this.opacity = Math.max(this.opacity, 0);
	c.strokeStyle = "rgb(255, 128, 0)";
	c.globalAlpha = this.opacity;
	c.lineWidth = this.width;
	c.beginPath();
	c.arc(this.x, this.y + p.worldY, this.size, 0, 2 * Math.PI);
	c.stroke();
	c.globalAlpha = 1;
	c.lineWidth = 5;
};
Explosion.prototype.update = function() {
	this.size ++;
	this.width += 0.5;
	this.opacity -= 0.01;
	if((Math.dist(this.x, this.y + p.worldY, p.x - 10, p.y) <= this.size || Math.dist(this.x, this.y + p.worldY, p.x + 10, p.y) <= this.size || Math.dist(this.x, this.y + p.worldY, p.x - 10, p.y + 46) <= this.size || Math.dist(this.x, this.y + p.worldY, p.x + 10, p.y + 45) <= this.size) && !(input.keys[40] && intangibilityTalisman.equipped)) {
		p.die("laser");
	}
	if(this.opacity <= 0) {
		this.splicing = true;
		p.surviveEvent("laser");
		game.addEvent();
	}
};
function Laser() {
	this.x = Math.random() * 800;
	this.y = Math.random() * 800;
	this.numMoves = 0;
	this.timeInLocation = 0;
	this.numBlinks = 0;
	this.timeSinceBlink = 0;
	this.blinking = false;
};
Laser.prototype.display = function() {
	if(this.blinking) {
		return;
	}
	c.strokeStyle = "rgb(255, 0, 0)";
	c.beginPath();
	c.arc(this.x, this.y + p.worldY, 50, 0, 2 * Math.PI);
	c.moveTo(this.x, this.y + p.worldY - 60);
	c.lineTo(this.x, this.y + p.worldY - 40);
	c.moveTo(this.x + 60, this.y + p.worldY);
	c.lineTo(this.x + 40, this.y + p.worldY);
	c.moveTo(this.x, this.y + p.worldY + 60);
	c.lineTo(this.x, this.y + p.worldY + 40);
	c.moveTo(this.x - 60, this.y + p.worldY);
	c.lineTo(this.x - 40, this.y + p.worldY);
	c.stroke();
};
Laser.prototype.update = function() {
	this.timeInLocation ++;
	if(this.timeInLocation > 60 && this.numMoves < 4) {
		this.x = Math.random() * 800;
		this.y = Math.random() * 800;
		this.numMoves ++;
		this.timeInLocation = 0;
	}
	if(this.numMoves === 4) {
		this.x = p.x;
		this.y = p.y;
		this.numMoves = Infinity;
	}
	if(this.numMoves === Infinity) {
		this.timeSinceBlink ++;
		if(this.timeSinceBlink > 7) {
			this.blinking = !this.blinking;
			this.timeSinceBlink = 0;
			this.numBlinks ++;
		}
		if(this.numBlinks > 6) {
			game.objects.push(new Explosion(this.x, this.y));
			game.objects.push(new Coin(this.x, this.y));
			this.splicing = true;
		}
	}
};
/* rising acid event */
function Acid() {
	this.y = 850;
	this.velY = 0;
};
Acid.prototype.display = function() {
	for(var x = 0; x < 800; x ++) {
		var brightness = Math.random() * 30;
		c.fillStyle = "rgb(" + brightness + ", 255, " + brightness + ")";
		c.fillRect(x, this.y + p.worldY + Math.sin(x / 10) * 10 * Math.sin(utilities.frameCount / 10), 1, 800);
	}
};
Acid.prototype.update = function() {
	/* update position */
	this.y += this.velY;
	if(this.y < 600 && this.velY < 0) {
		/* screen scrolling */
		p.worldY -= this.velY;
		p.y -= this.velY;
	}
	if(this.y < -100) {
		this.stopRising();
	}
	if(this.velY > 0 && this.y >= 850) {
		this.velY = 0;
		this.y = 850;
		p.surviveEvent("acid");
		game.addEvent();
		this.splicing = true;
	}
	/* player collisions */
	if(p.y + 46 > this.y + p.worldY) {
		p.die("acid");
		if(p.invincible) {
			p.velY = Math.min(-5, p.velY);
			if(input.keys[38]) {
				p.velY = Math.min(-8.5, p.velY);
			}
		}
	}
};
Acid.prototype.beginRising = function() {
	this.velY = -2;
	game.objects.push(new Platform(320, 40, 160, 20));
	game.objects.push(new Platform(0, -135, 160, 20));
	game.objects.push(new Platform(800 - 160, -135, 160, 20));
	game.objects.push(new Platform(320, -310, 160, 20));
	game.objects.push(new Platform(0, -485, 160, 20));
	game.objects.push(new Platform(800 - 160, -485, 160, 20));
	for(var i = 0; i < game.objects.length; i ++) {
		if(game.objects[i] instanceof Platform && game.objects[i].y <= 210) {
			game.objects[i].opacity = 0;
		}
	}
	game.objects.push(new Coin(400, 0, 0));
	game.chatMessages.push(new ChatMessage("The tides are rising...", "rgb(255, 128, 0)"));
};
Acid.prototype.stopRising = function() {
	this.velY = 1;
	/* shift everything down back to the original playing area */
	p.worldY = 0;
	this.y += 700;
	/* delete platforms from acid rise */
	for(var i = 0; i < game.objects.length; i ++) {
		if(game.objects[i].y < 200) {
			game.objects[i].splicing = true;
		}
		/* remove platform afterimages if the player has the confusion effect */
		if(game.objects[i] instanceof AfterImage && game.objects[i].image instanceof Platform && game.objects[i].image.y < 200) {
			game.objects[i].splicing = true;
		}
		/* translate other afterimages down */
		if(game.objects[i] instanceof AfterImage && !game.objects[i].splicing) {
			game.objects[i].image.y += 700;
		}
	}
};
/* boulders event */
function Boulder(x, y, velX) {
	this.x = x;
	this.y = y;
	this.velX = velX;
	this.velY = 0;
	this.numBounces = 0;
};
Boulder.prototype.display = function() {
	c.fillStyle = "rgb(100, 100, 100)";
	c.beginPath();
	c.arc(this.x, this.y, 50, 0, 2 * Math.PI);
	c.fill();
};
Boulder.prototype.update = function() {
	this.x += this.velX;
	this.y += this.velY;
	this.velY += 0.1;
	for(var i = 0; i < game.objects.length; i ++) {
		if(game.objects[i] instanceof Platform && this.x + 50 > game.objects[i].x && this.x - 50 < game.objects[i].x + game.objects[i].w && this.y + 50 > game.objects[i].y && this.y + 50 < game.objects[i].y + 10) {
			this.numBounces ++;
			if(this.numBounces === 1) {
				this.velY = -4;
			}
			if(this.numBounces === 2) {
				this.velY = -3;
			}
			if(this.numBounces === 3) {
				this.velY = -2;
			}
		}
	}
	/* killing player */
	if((Math.dist(this.x, this.y, p.x - 5, p.y) <= 50 || Math.dist(this.x, this.y, p.x + 5, p.y) <= 50 || Math.dist(this.x, this.y, p.x - 5, p.y + 46) <= 50 || Math.dist(this.x, this.y, p.x + 5, p.y + 46) <= 50) && !(input.keys[40] && intangibilityTalisman.equipped)) {
		p.die("boulder");
	}
	/* delete self if off-screen */
	if((this.velX < 0 && this.x < 50) || (this.velX > 0 && this.x > 750)) {
		for(var j = 0; j < 10; j ++) {
			game.objects.push(new RockParticle(Math.random() * 20 + this.x, Math.random() * 20 + this.y));
		}
		game.objects.push(new Coin(this.x, this.y));
		this.splicing = true;
		p.surviveEvent("boulder");
	}
};
function RockParticle(x, y) {
	this.x = x;
	this.y = y;
	this.velX = Math.random(-5, 5);
	this.velY = Math.random(-1, -2);
};
RockParticle.prototype.display = function() {
	c.fillStyle = "rgb(100, 100, 100)";
	c.beginPath();
	c.arc(this.x, this.y, 10, 0, 2 * Math.PI);
	c.fill();
};
RockParticle.prototype.update = function() {
	this.x += this.velX;
	this.y += this.velY;
	this.velY += 0.1;
	this.velX *= 0.96;
	if(this.y > 850) {
		this.splicing = true;
		if(game.numObjects(RockParticle) === 1) {
			/* This is the last rock particle, so end the event */
			game.addEvent();
			p.surviveEvent("boulders");
		}
	}
};
/* spinny blades event */
function SpinnyBlade(x, y) {
	this.x = x;
	this.y = y;
	this.r = 0.5 * Math.PI;
	this.numRevolutions = 0;
	this.opacity = 0;
};
SpinnyBlade.prototype.display = function() {
	c.fillStyle = "rgb(215, 215, 215)";
	c.globalAlpha = this.opacity;
	c.save();
	c.translate(this.x, this.y + p.worldY);
	c.rotate(this.r);
	c.beginPath();
	c.moveTo(-5, 0);
	c.lineTo(5, 0);
	c.lineTo(0, -80);
	c.fill();
	c.beginPath();
	c.moveTo(-5, 0);
	c.lineTo(5, 0);
	c.lineTo(0, 80);
	c.fill();
	c.restore();
	c.globalAlpha = 1;
};
SpinnyBlade.prototype.update = function() {
	if(this.opacity >= 1) {
		this.r += 0.02;
	}
	this.r -= (this.r > 2 * Math.PI ? 2 * Math.PI : 0);
	if(this.r > 0.5 * Math.PI - 0.01 && this.r < 0.5 * Math.PI + 0.01 && this.opacity >= 1) {
		this.numRevolutions ++;
	}
	if(this.opacity < 1 && this.numRevolutions < 2) {
		this.opacity += 0.05;
	}
	if(this.opacity > 0 && this.numRevolutions >= 2) {
		this.opacity -= 0.05;
	}
	var endPoint1 = Math.rotate(0, -80, this.r);
	var endPoint2 = { x: -endPoint1.x, y: -endPoint1.y };
	endPoint1.x += this.x; endPoint2.x += this.x;
	endPoint1.y += this.y; endPoint2.y += this.y;
	var bladeArray = Math.findPointsLinear(endPoint1.x, endPoint1.y, endPoint2.x, endPoint2.y);
	for(var i = 0; i < bladeArray.length; i ++) {
		if(bladeArray[i].x > p.x - 5 && bladeArray[i].x < p.x + 5 && bladeArray[i].y > p.y && bladeArray[i].y < p.y + 46 && !(input.keys[40] && intangibilityTalisman.equipped)) {
			p.die("spinnyblades");
		}
	}
	if(this.opacity <= 0 && this.numRevolutions >= 2) {
		this.splicing = true;
		p.surviveEvent("spinnyblades");
		if(game.numObjects(SpinnyBlade) === 1) {
			/* This is the last spinnyblade, so end the event */
			p.surviveEvent("spinnyblades");
			game.addEvent();
		}
	}
};
/* jumping pirhanas event */
function Pirhana(x) {
	this.x = x;
	this.y = 850;
	this.velY = -10;
	this.scaleY = 1;
	this.mouth = 1; // 1 = open, 0 = closed
	this.mouthVel = 0;
};
Pirhana.prototype.display = function() {
	c.fillStyle = "rgb(0, 128, 0)";
	c.save();
	c.translate(this.x, this.y);
	c.scale(1, this.scaleY);
	c.beginPath();
	c.arc(0, 0, 25, 0, Math.PI);
	c.fill();
	c.beginPath();
	c.arc(0, 0, 25, -0.5 * Math.PI + this.mouth, 0.5 * Math.PI + this.mouth);
	c.fill();
	c.beginPath();
	c.arc(0, 0, 25, 0.5 * Math.PI - this.mouth, -0.5 * Math.PI - this.mouth);
	c.fill();
	c.beginPath();
	c.moveTo(0, 12);
	c.lineTo(-25, 37);
	c.lineTo(25, 37);
	c.fill();
	c.restore();
};
Pirhana.prototype.update = function() {
	this.y += this.velY;
	this.velY += 0.1;
	if(this.scaleY > -1 && this.velY > 0) {
		this.scaleY -= 0.1;
	}
	this.mouth += this.mouthVel;
	if(Math.dist(this.x, this.y, p.x, p.y) < 100 && this.mouthVel === 0) {
		this.mouthVel = -0.05;
	}
	if(this.mouth <= 0) {
		this.mouthVel = 0.1;
	}
	if(this.mouth > 1) {
		this.mouthVel = 0;
		this.mouth = 1;
	}
	if(p.x + 5 > this.x - 25 && p.x - 5 < this.x + 25 && p.y + 46 > this.y - 25 && p.y < this.y + 37 && !(input.keys[40] && intangibilityTalisman.equipped)) {
		p.die("pirhanas");
	}
	if(this.y > 850 && this.velY > 0) {
		this.splicing = true;
		if(game.numObjects(Pirhana) === 1) {
			game.addEvent();
			p.surviveEvent("pirhanas");
		}
	}
};
/* giant pacman event */
function Dot(x, y, timeToAppear) {
	this.x = x;
	this.y = y;
	this.timeToAppear = timeToAppear;
};
Dot.prototype.display = function() {
	if(this.timeToAppear <= 0) {
		c.fillStyle = "rgb(255, 255, 255)";
		c.beginPath();
		c.arc(this.x, this.y, 20, 0, 2 * Math.PI);
		c.fill();
	}
};
Dot.prototype.update = function() {
	this.timeToAppear --;
};
function Pacman(x, y, velX) {
	this.x = x;
	this.y = y;
	this.velX = velX;
	this.mouth = 1;
	this.mouthVel = -0.01;
};
Pacman.prototype.display = function() {
	c.fillStyle = "rgb(255, 255, 0)";
	c.save();
	c.translate(this.x, this.y);
	c.rotate(this.r);
	c.beginPath();
	c.arc(0, 0, 200, 0, Math.PI);
	c.fill();
	c.beginPath();
	c.arc(0, 0, 200, -0.5 * Math.PI + this.mouth, 0.5 * Math.PI + this.mouth);
	c.fill();
	c.beginPath();
	c.arc(0, 0, 200, 0.5 * Math.PI - this.mouth, -0.5 * Math.PI - this.mouth);
	c.fill();
	c.restore();
};
Pacman.prototype.update = function() {
	if(this.velX > 0) {
		this.r = 0.5 * Math.PI;
	}
	else {
		this.r = -0.5 * Math.PI;
	}
	this.x += this.velX;
	this.mouth += this.mouthVel;
	if(this.mouth <= 0) {
		this.mouthVel = 0.01;
	}
	else if(this.mouth >= 1) {
		this.mouthVel = -0.01;
	}
	if((Math.dist(this.x, this.y, p.x - 5, p.y) <= 200 || Math.dist(this.x, this.y, p.x + 5, p.y) <= 200 || Math.dist(this.x, this.y, p.x - 5, p.y + 46) <= 200 || Math.dist(this.x, this.y, p.x + 5, p.y + 46) <= 200) && !(input.keys[40] && intangibilityTalisman.equipped)) {
		p.die("pacmans");
	}
	/* remove dots when eaten */
	for(var i = 0; i < game.objects.length; i ++) {
		if(game.objects[i] instanceof Dot && game.objects[i].y === this.y && ((game.objects[i].x < this.x - 20 && this.velX > 0) || (game.objects[i].x > this.x + 20 && this.velX < 0))) {
			game.objects[i].splicing = true;
		}
	}
	/* remove self when off screen */
	if((this.x > 1200 && this.velX > 0) || (this.x < -200 && this.velX < 0)) {
		this.splicing = true;
		if(game.numObjects(Pacman) === 1) {
			game.addEvent();
			p.surviveEvent("pacmans");
		}
	}
};
/* rocket event */
function FireParticle(x, y) {
	this.x = x;
	this.y = y;
	this.velX = Math.random();
	this.velY = Math.random();
	this.opacity = 0.75;
	this.color = Math.random() * 20 + 100;
	this.size = 10;
};
FireParticle.prototype.display = function() {
	c.globalAlpha = this.opacity;
	c.fillStyle = "rgb(255, " + this.color + ", 0)";
	c.beginPath();
	if(this.size > 0) {
		c.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
	}
	c.fill();
	c.globalAlpha = 1;
};
FireParticle.prototype.update = function() {
	this.opacity -= 0.01;
	this.size -= 0.5;
	this.x += this.velX;
	this.y += this.velY;
	if(this.size <= 0) {
		this.splicing = true;
	}
};
function Rocket(x, y, velX) {
	this.x = x;
	this.y = y;
	this.velX = velX;
};
Rocket.prototype.display = function() {
	c.fillStyle = "rgb(100, 100, 100)";
	if(this.velX > 0) {
		c.fillRect(this.x, this.y, 50, 20);
		/* tip */
		c.beginPath();
		c.moveTo(this.x + 50, this.y);
		c.lineTo(this.x + 100, this.y + 10);
		c.lineTo(this.x + 50, this.y + 20);
		c.fill();
		/* top back spike */
		c.beginPath();
		c.moveTo(this.x, this.y);
		c.lineTo(this.x - 50, this.y - 5);
		c.lineTo(this.x, this.y + 10);
		c.fill();
		/* bottom back spike */
		c.beginPath();
		c.moveTo(this.x, this.y + 20);
		c.lineTo(this.x - 50, this.y + 25);
		c.lineTo(this.x, this.y + 10);
		c.fill();
	}
	else {
		c.fillRect(this.x - 50, this.y, 50, 20);
		/* tip */
		c.beginPath();
		c.moveTo(this.x - 50, this.y);
		c.lineTo(this.x - 100, this.y + 10);
		c.lineTo(this.x - 50, this.y + 20);
		c.fill();
		/* top backspike */
		c.beginPath();
		c.moveTo(this.x, this.y);
		c.lineTo(this.x + 50, this.y - 5);
		c.lineTo(this.x, this.y + 10);
		c.fill();
		/* bottom backspike */
		c.beginPath();
		c.moveTo(this.x, this.y + 20);
		c.lineTo(this.x + 50, this.y + 25);
		c.lineTo(this.x, this.y + 10);
		c.fill();
	}
};
Rocket.prototype.update = function() {
	this.x += this.velX;
	if(utilities.frameCount % 1 === 0) {
		game.objects.push(new FireParticle(this.x, this.y + 10));
	}
	if(this.velX > 0) {
		if(p.x + 5 > this.x - 50 && p.x - 5 < this.x + 100 && p.y + 46 > this.y && p.y < this.y + 10 && !(input.keys[40] && intangibilityTalisman.equipped)) {
			p.die("rocket");
		}
	}
	else {
		if(p.x + 5 > this.x - 100 && p.x - 5 < this.x + 50 && p.y + 46 > this.y && p.y < this.y + 10 && !(input.keys[40] && intangibilityTalisman.equipped)) {
			p.die("rocket");
		}
	}
	/* remove self if off-screen */
	if(this.x < -100 || this.x > 900) {
		this.splicing = true;
		game.addEvent();
		p.surviveEvent("rocket");
	}
	/* add coin if in middle of screen */
	if(this.x > 398 && this.x < 402) {
		game.objects.push(new Coin(this.x, this.y + 5));
	}
};
/* spikeball event */
function Spikeball(velX, velY) {
	this.x = 400;
	this.y = 400;
	this.velX = velX;
	this.velY = velY;
	this.r = 0;
	this.age = 0;
	this.opacity = 0;
	this.fadedIn = false;
};
Spikeball.prototype.display = function() {
	c.fillStyle = "rgb(150, 150, 155)";
	c.globalAlpha = this.opacity;
	var movedTo = false;
	c.save();
	c.translate(this.x, this.y + p.worldY);
	c.rotate(this.r);
	c.beginPath();
	for(var degrees = 0; degrees < 360; degrees += 18) {
		if(degrees % 36 === 0) {
			var point = Math.rotateDegrees(0, -30, degrees);
		}
		else {
			var point = Math.rotateDegrees(0, -20, degrees);
		}
		if(!movedTo) {
			c.moveTo(point.x, point.y);
			movedTo = true;
		}
		else {
			c.lineTo(point.x, point.y);
		}
	}
	c.fill();
	c.restore();
	c.globalAlpha = 1;
};
Spikeball.prototype.update = function() {
	this.r += 0.1;
	/* fading in */
	if(!this.fadedIn) {
		this.opacity += 0.05;
	}
	if(this.opacity >= 1) {
		this.fadedIn = true;
	}
	if(this.fadedIn) {
		this.x += this.velX;
		this.y += this.velY;
		this.age ++;
		this.opacity -= 0.002;
	}
	/* platform + wall collisions */
	if(this.age > 20) {
		var platforms = game.getObjectsByType(Platform);
		for(var i = 0; i < platforms.length; i ++) {
			if(this.x + 30 > platforms[i].x && this.x - 30 < platforms[i].x + platforms[i].w && this.y + 30 > platforms[i].y && this.y + 30 < platforms[i].y + 6) {
				this.velY = -this.velY;
			}
			if(this.x + 30 > platforms[i].x && this.x - 30 < platforms[i].x + platforms[i].w && this.y - 30 < platforms[i].y + platforms[i].h && this.y - 30 > platforms[i].y + platforms[i].h - 6) {
				this.velY = -this.velY;
			}
			if(this.y + 30 > platforms[i].y && this.y - 30 < platforms[i].y + platforms[i].h && this.x + 30 > platforms[i].x && this.x + 30 < platforms[i].x + 6) {
				this.velX = -this.velX;
			}
			if(this.y + 30 > platforms[i].y && this.y - 30 < platforms[i].y + platforms[i].h && this.x - 30 < platforms[i].x + platforms[i].w && this.x - 30 > platforms[i].x + platforms[i].w - 6) {
				this.velX = -this.velX;
			}
		}
		if(this.x + 30 > 800 || this.x - 30 < 0) {
			this.velX = -this.velX;
		}
		if(this.y - 30 < 0 || this.y + 30 > 800) {
			this.velY = -this.velY;
		}
	}
	/* player collisions */
	if((Math.dist(this.x, this.y, p.x - 5, p.y) <= 30 || Math.dist(this.x, this.y, p.x + 5, p.y) <= 30 || Math.dist(this.x, this.y, p.x - 5, p.y + 46) <= 30 || Math.dist(this.x, this.y, p.x + 5, p.y + 46) <= 30) && this.age > 20 && !(input.keys[40] && intangibilityTalisman.equipped)) {
		p.die("spikeballs");
	}
	/* remove self if faded out */
	if(this.opacity <= 0) {
		this.splicing = true;
		if(game.numObjects(Spikeball) === 1) {
			game.addEvent();
			p.surviveEvent("spikeballs");
		}
	}
};
/* spike wall event */
function Spikewall(x) {
	this.fastSpeed = 10;
	this.slowSpeed = 2;
	this.x = x;
	this.velX = (x < 400) ? this.fastSpeed : -this.fastSpeed;
};
Spikewall.prototype.display = function() {
	c.strokeStyle = "rgb(215, 215, 215)";
	c.fillStyle = "rgb(100, 100, 100)";
	if(this.velX === this.fastSpeed || this.velX === -this.slowSpeed) {
		c.fillRect(this.x - 800, 0, 800, 800);
		c.strokeRect(this.x - 800, 0, 800, 800);
		for(var y = 0; y < 800; y += 40) {
			c.fillStyle = "rgb(215, 215, 215)";
			c.beginPath();
			c.moveTo(this.x, y);
			c.lineTo(this.x, y + 40);
			c.lineTo(this.x + 20, y + 20);
			c.fill();
		}
	}
	else {
		c.fillRect(this.x, 0, 800, 800);
		for(var y = 0; y < 800; y += 40) {
			c.fillStyle = "rgb(215, 215, 215)";
			c.beginPath();
			c.moveTo(this.x, y);
			c.lineTo(this.x, y + 40);
			c.lineTo(this.x - 20, y + 20);
			c.fill();
		}
	}
};
Spikewall.prototype.update = function() {
	this.x += this.velX;
	if(this.velX === this.fastSpeed && this.x > 250) {
		this.velX = -this.slowSpeed;
		game.objects.push(new Coin(80, (Math.random() < 0.5) ? 175 : 525));
	}
	if(this.velX === -this.fastSpeed && this.x < 550) {
		this.velX = this.slowSpeed;
		game.objects.push(new Coin(720, (Math.random() < 0.5) ? 175 : 525));
	}
	if(this.velX === -this.fastSpeed || this.velX === this.slowSpeed) {
		if(p.x + 5 > this.x && !(input.keys[40] && intangibilityTalisman.equipped)) {
			p.die("spikewall");
		}
	}
	if(this.velX === this.fastSpeed || this.velX === -this.slowSpeed && !(input.keys[40] && intangibilityTalisman.equipped)) {
		if(p.x - 5 < this.x) {
			p.die("spikewall");
		}
	}
	if((this.velX < 0 && this.x < -50) || (this.velX > 0 && this.x > 850)) {
		this.splicing = true;
		game.addEvent();
		p.surviveEvent("spikewall");
	}
};
/* lasting effects (blindness, confusion, nausea) */
function AfterImage(image) {
	this.image = image;
	var timeElapsed = (FPS * 15) - p.timeConfused;
	if(timeElapsed < FPS * 14) {
		this.timeLeft = Math.map(
			timeElapsed,
			0, FPS * 15,
			30, 20
		);
	}
	else {
		this.timeLeft = Math.map(
			timeElapsed,
			FPS * 14, FPS * 15,
			20, 0
		);
	}
	this.timeToExist = this.timeLeft;
};
AfterImage.prototype.display = function() {
	var opacity = this.timeLeft / this.timeToExist;
	opacity = Math.constrain(opacity, 0, 1);
	c.save();
	if(this.image instanceof Player) {
		c.translate(0, 1 * p.worldY);
	}
	c.globalAlpha = opacity;
	this.image.display();
	c.restore();
};
AfterImage.prototype.update = function() {
	this.timeLeft --;
	if(this.timeLeft <= 0) {
		this.splicing = true;
	}
};
var effects = {
	remove: function() {
		game.events.removeAll("blindness");
		game.events.removeAll("confusion");
		game.events.removeAll("nausea");
	},
	add: function() {
		if(!game.events.includes("blindness")) {
			game.events.push("blindness");
		}
		if(!game.events.includes("confusion")) {
			game.events.push("confusion");
		}
		if(!game.events.includes("nausea")) {
			game.events.push("nausea");
		}
	},
	displayNauseaEffect: function(obj) {
		/*
		Displays two copies of 'obj' around it.
		*/
		var offsetX = p.nauseaOffsetArray[p.nauseaOffset].x;
		var offsetY = p.nauseaOffsetArray[p.nauseaOffset].y;
		var timeElapsed = (FPS * 15) - p.timeNauseated;
		if(timeElapsed < FPS * 14) {
			var intensity = Math.map(timeElapsed, 0, FPS * 14, 1.5, 1);
		}
		else {
			var intensity = Math.map(timeElapsed, FPS * 14, FPS * 15, 1, 0);
		}
		offsetX *= intensity;
		offsetY *= intensity;
		obj.x += offsetX;
		obj.y += offsetY;
		obj.display();
		obj.x -= 2 * offsetX;
		obj.y -= 2 * offsetY;
		obj.display();
		obj.x += offsetX;
		obj.y += offsetY;
	},
	displayBlindnessEffect: function() {
		/*
		When timeElapsed is 0, largeRadius is 150 and smallRadius is 50.
		When timeElapsed is FPS * 15, largeRadius and smallRadius are SCREEN_DIAGONAL_LENGTH.
		*/
		const SCREEN_DIAGONAL_LENGTH = Math.dist(0, 0, 800, 800);
		var timeElapsed = (FPS * 15) - p.timeBlinded;
		if(timeElapsed < FPS * 14) {
			var largeRadius = Math.map(
				timeElapsed,
				0, FPS * 14,
				150, 400
			);
			var smallRadius = Math.map(
				timeElapsed,
				0, FPS * 14,
				50, 390
			);
		}
		else {
			var largeRadius = Math.map(
				timeElapsed,
				FPS * 14, FPS * 15,
				400, SCREEN_DIAGONAL_LENGTH
			);
			var smallRadius = Math.map(
				timeElapsed,
				FPS * 14, FPS * 15,
				390, SCREEN_DIAGONAL_LENGTH
			);
		}

		c.globalAlpha = 1;
		var gradient = c.createRadialGradient(p.x, p.y, smallRadius, p.x, p.y, largeRadius);
		gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
		gradient.addColorStop(1, "rgba(0, 0, 0, 255)");
		c.fillStyle = gradient;
		c.fillRect(0, 0, 800, 800);
	},
	displayConfusionEffect: function() {
		/*
		Creates afterimages of all the objects in the game.
		*/
		if(utilities.frameCount % 3 !== 0) {
			return;
		}
		var skippedObjects = [
			AfterImage, // to prevent infinite recursion
			FireParticle, // to reduce lag
			Acid, // to reduce lag + isn't really that noticeable
			Spikewall, // not really that noticeable
			Coin, // to make the coins not look strange
			Dot, // not visible at all since dots don't move
		];
		outerLoop: for(var i = 0; i < game.objects.length; i ++) {
			innerLoop: for(var j = 0; j < skippedObjects.length; j ++) {
				if(game.objects[i] instanceof skippedObjects[j]) {
					continue outerLoop;
				}
			}
			if(game.objects[i].splicing) {
				continue;
			}
			game.objects.push(new AfterImage(game.objects[i].clone()));
		}

		var playerAfterImage = p.clone();
		playerAfterImage.y -= p.worldY;
		game.objects.push(new AfterImage(playerAfterImage.clone()));
	}
};
/* generic event selection + running */
var game = {
	events: [
		"laser", "acid", "boulder", "spinnyblades", "pirhanas", "pacmans", "rocket", "spikeballs", "block shuffle", "spikewall", "confusion", "blindness", "nausea"
	],
	currentEvent: null,
	timeToEvent: -5,
	objects: [],
	chatMessages: [],
	screen: "home",

	numObjects: function(constructor) {
		return game.getObjectsByType(constructor).length;
	},
	getObjectsByType: function(constructor) {
		/*
		Returns a list containing references to all instances of 'constructor' in objects.
		*/
		var arr = [];
		for(var i = 0; i < game.objects.length; i ++) {
			if(game.objects[i] instanceof constructor) {
				arr.push(game.objects[i]);
			}
		}
		return arr;
	},
	initializePlatforms: function() {
		for(var y = 225; y <= 575; y += 175) {
			if((y - 225) % (175 * 2) === 0) {
				game.objects.push(new Platform(0, y - 10, 160, 20));
				game.objects.push(new Platform(800 - 160, y - 10, 160, 20));
			}
			else {
				game.objects.push(new Platform(400 - (160 / 2), y - 10, 160, 20));
			}
		}
	},
	sortObjects: function() {
		var inverted = false;
		var sorter = function(a, b) {
			const A_FIRST = -1;
			const B_FIRST = 1;
			/* afterimages */
			if(a instanceof AfterImage) {
				a = a.image;
			}
			if(b instanceof AfterImage) {
				b = b.image;
			}
			/* things that are rendered behind everything else */
			if(a instanceof Coin || a instanceof Dot) {
				return A_FIRST;
			}
			/* things that are rendered in front of everything else */
			if(a instanceof Spikewall || a instanceof Acid || a instanceof Pacman || a instanceof Player) {
				return B_FIRST;
			}
			/* special cases */
			if(a instanceof FireParticle && b instanceof Rocket) {
				return A_FIRST;
			}
			if(a instanceof Platform && b instanceof SpinnyBlade) {
				return A_FIRST;
			}
			if(a instanceof Platform && b instanceof Explosion) {
				return A_FIRST;
			}
			if(a instanceof Platform && b instanceof Dot) {
				return A_FIRST;
			}
			if(a instanceof Platform && b instanceof Spikeball) {
				return A_FIRST;
			}
			if(a instanceof Platform && b instanceof Laser) {
				return A_FIRST;
			}
			/* inverse cases */
			if(!inverted) {
				/* Variable 'inverted' is used to prevent infinite recursion */
				inverted = true;
				var invertedOrder = sorter(b, a);
				inverted = false;
				return invertedOrder * -1;
			}
			/* default case */
			return A_FIRST;
		};
		game.objects = utilities.sort(game.objects, sorter);
	},

	addEvent: function() {
		p.score ++;
		game.currentEvent = game.events.randomItem();
		if(game.currentEvent === p.previousEvent) {
			p.repeatedEvent = true;
		}
		p.previousEvent = game.currentEvent;
		if(p.score === p.highScore + 1) {
			p.numRecords ++;
			game.chatMessages.push(new ChatMessage("New Record!", "rgb(0, 0, 255)"));
		}

		if(game.currentEvent === "laser") {
			game.objects.push(new Laser());
			game.chatMessages.push(new ChatMessage("Laser incoming!", "rgb(255, 128, 0)"));
		}
		else if(game.currentEvent === "acid") {
			game.objects.push(new Acid());
			game.objects[game.objects.length - 1].beginRising();
		}
		else if(game.currentEvent === "boulder") {
			var chooser = Math.random();
			game.chatMessages.push(new ChatMessage("Boulder incoming!", "rgb(255, 128, 0)"));
			if(chooser < 0.5) {
				game.objects.push(new Boulder(850, 100, -3));
			}
			else {
				game.objects.push(new Boulder(-50, 100, 3));
			}
		}
		else if(game.currentEvent === "spinnyblades") {
			game.chatMessages.push(new ChatMessage("Spinning blades are appearing", "rgb(255, 128, 0)"));
			for(var i = 0; i < game.objects.length; i ++) {
				if(game.objects[i] instanceof Platform) {
					game.objects.push(new SpinnyBlade(game.objects[i].x + 80, game.objects[i].y + 10));
				}
			}
		}
		else if(game.currentEvent === "pirhanas") {
			game.chatMessages.push(new ChatMessage("Jumping pirhanas incoming!", "rgb(255, 128, 0)"));
			/* fancy algorithm to make sure none of the pirhanas are touching */
			var pirhanasSeparated = false;
			while(!pirhanasSeparated) {
				for(var i = 0; i < game.objects.length; i ++) {
					if(game.objects[i] instanceof Pirhana) {
						game.objects.splice(i, 1);
						i --;
						continue;
					}
				}
				game.objects.push(new Pirhana(Math.random() * 700 + 50));
				game.objects.push(new Pirhana(Math.random() * 700 + 50));
				game.objects.push(new Pirhana(Math.random() * 700 + 50));
				pirhanasSeparated = true;
				for(var i = 0; i < game.objects.length; i ++) {
					/* check if they collide */
					for(var j = 0; j < game.objects.length; j ++) {
						if(i !== j && game.objects[i] instanceof Pirhana && game.objects[j] instanceof Pirhana && Math.abs(game.objects[i].x - game.objects[j].x) < 75) {
							pirhanasSeparated = false;
						}
					}
				}
			}
		}
		else if(game.currentEvent === "pacmans") {
			game.chatMessages.push(new ChatMessage("Pacmans incoming!", "rgb(255, 128, 0)"));
			var coinNum = Math.round(Math.random() * 11 + 1) * 60;
			coinNum = 7 * 60;
			for(var x = 0; x < 800; x += 60) {
				if(x === coinNum) {
					game.objects.push(new Coin(x, 200, x * 0.25));
				} else {
					game.objects.push(new Dot(x, 200, x * 0.25));
				}
				game.objects.push(new Dot(800 - x, 600, x * 0.25));
			}
			game.objects.push(new Pacman(-200, 200, 1.5));
			game.objects.push(new Pacman(1000, 600, -1.5));
		}
		else if(game.currentEvent === "rocket") {
			game.chatMessages.push(new ChatMessage("Rocket incoming!", "rgb(255, 128, 0)"));
			if(p.x > 400) {
				game.objects.push(new Rocket(-50, p.y, 6));
			}
			else {
				game.objects.push(new Rocket(850, p.y, -6));
			}
		}
		else if(game.currentEvent === "spikeballs") {
			game.chatMessages.push(new ChatMessage("Spikeballs incoming!", "rgb(255, 128, 0)"));
			var angles = [];
			var buffer = 30;
			for(var i = 0; i < 360; i ++) {
				if((i > 90 - buffer && i < 90 + buffer) || (i > 270 - buffer && i < 270 + buffer)) {
					continue;
				}
				angles.push(i);
			}
			for(var i = 0; i < 3; i ++) {
				var index = Math.floor(Math.random() * (angles.length - 1));
				var angle = angles[index];
				for(var j = 0; j < angles.length; j ++) {
					var distanceBetweenAngles = Math.min(Math.abs(angle - angles[j]), Math.abs((angle + 360) - angles[j]), Math.abs((angle - 360) - angles[j]));
					if(distanceBetweenAngles < buffer) {
						angles.splice(j, 1);
						j --;
						continue;
					}
				}
				var angleRadians = angle / 180 * Math.PI;
				var velocity = Math.rotateDegrees(0, -5, angle);
				game.objects.push(new Spikeball(velocity.x, velocity.y));
			}
		}
		else if(game.currentEvent === "block shuffle") {
			game.chatMessages.push(new ChatMessage("The blocks are shuffling", "rgb(255, 128, 0)"));
			var platforms = game.getObjectsByType(Platform);
			for(var i = 0; i < platforms.length; i ++) {
				if(platforms[i].y < 300) {
					if(platforms[i].x < 400) {
						platforms[i].destX = 0;
						platforms[i].destY = 565;
					}
					else {
						platforms[i].destX = 0;
						platforms[i].destY = 215;
					}
				}
				if(platforms[i].y > 400) {
					if(platforms[i].x < 400) {
						platforms[i].destX = 320;
						platforms[i].destY = 390;
					}
					else {
						platforms[i].destX = 640;
						platforms[i].destY = 215;
					}
				}
				if(platforms[i].y > 300 && platforms[i].y < 400) {
					platforms[i].destX = 640;
					platforms[i].destY = 565;
				}
				platforms[i].calculateVelocity();
			}
		}
		else if(game.currentEvent === "spikewall") {
			var spikeWallDistance = 1500;
			if(Math.random() < 0.5) {
				game.objects.push(new Spikewall(-spikeWallDistance));
				game.chatMessages.push(new ChatMessage("Spike wall incoming from the left!", "rgb(255, 128, 0)"));
			}
			else {
				game.objects.push(new Spikewall(800 + spikeWallDistance));
				game.chatMessages.push(new ChatMessage("Spike wall incoming from the right!", "rgb(255, 128, 0)"));
			}
		}
		else if(game.currentEvent === "confusion") {
			game.timeToEvent = FPS * 3;
			p.timeConfused = FPS * 15;
			game.chatMessages.push(new ChatMessage("You have been confused", "rgb(0, 255, 0)"));
			effects.remove();
			game.currentEvent = null;
		}
		else if(game.currentEvent === "blindness") {
			game.timeToEvent = FPS * 3;
			p.timeBlinded = FPS * 15;
			game.chatMessages.push(new ChatMessage("You have been blinded", "rgb(0, 255, 0)"));
			effects.remove();
			game.currentEvent = null;
		}
		else if(game.currentEvent === "nausea") {
			game.timeToEvent = FPS * 3;
			p.timeNauseated = FPS * 15;
			game.chatMessages.push(new ChatMessage("You have been nauseated", "rgb(0, 255, 0)"));
			effects.remove();
			game.currentEvent = null;
		}
	},
	runEvent: function() {
		game.timeToEvent --;
		if(game.timeToEvent <= 0 && game.currentEvent === null) {
			game.addEvent();
		}
		/* update objects */
		for(var i = 0; i < game.objects.length; i ++) {
			if(typeof game.objects[i].update === "function") {
				game.objects[i].update();
			}
			else {
				console.warn("An in-game object of type " + game.objects[i].constructor.name + " did not have a update() method.");
			}
			if(game.objects[i].splicing) {
				game.objects.splice(i, 1);
				i --;
				continue;
			}
		}
		/* display objects */
		game.sortObjects();
		for(var i = 0; i < game.objects.length; i ++) {
			if(game.objects[i].splicing) {
				continue;
			}
			if(typeof game.objects[i].display === "function") {
				game.objects[i].display();
			}
			else {
				console.warn("An in-game object of type " + game.objects[i].constructor.name + " did not have a display() method.");
			}
		}
		/* visual effects */
		if(p.timeBlinded > 0) {
			effects.displayBlindnessEffect();
		}
		if(p.timeNauseated > 0) {
			effects.displayNauseaEffect(p);
			for(var i = 0; i < game.objects.length; i ++) {
				if(game.objects[i].splicing) {
					continue;
				}
				if(typeof game.objects[i].display === "function") {
					effects.displayNauseaEffect(game.objects[i]);
				}
			}
		}
		if(p.timeConfused > 0) {
			effects.displayConfusionEffect();
		}
	}
};
// game.events = TESTING_MODE ? ["spinnyblades"] : game.events;

function doByTime() {
	utilities.canvas.resize();
	if(game.screen === "home") {
		/* background + erase previous frame */
		c.fillStyle = "rgb(200, 200, 200)";
		c.fillRect(0, 0, 800, 800);
		/* title */
		c.font = "50px cursive";
		c.fillStyle = "rgb(100, 100, 100)";
		c.textAlign = "center";
		if(!TESTING_MODE) {
			c.fillText("Randomonicity", 400, 150);
			c.fillText("Survival", 400, 200);
		}
		/* buttons */
		for(var i = 0; i < dollarIcons.length; i ++) {
			dollarIcons[i].display();
			if(dollarIcons[i].y >= 545) {
				dollarIcons.splice(i, 1);
				i --;
			}
		}
		shopButton.display();
		shopButton.mouseOver = shopButton.hasMouseOver();
		shopButton.checkForClick();
		achievementsButton.display();
		achievementsButton.mouseOver = achievementsButton.hasMouseOver();
		achievementsButton.checkForClick();
		playButton.display();
		playButton.mouseOver = playButton.hasMouseOver();
		playButton.checkForClick();
	}
	else if(game.screen === "play") {
		c.fillStyle = "rgb(200, 200, 200)";
		c.fillRect(0, 0, 800, 800);
		/* player */
		p.display();
		p.update();
		/* random events */
		game.runEvent();
		if(p.y + 46 >= 800 && (game.numObjects(Acid) === 0 || game.getObjectsByType(Acid)[0].y + p.worldY > 820)) {
			p.die("fall");
		}
		/* shop status effect indicators */
		var hasOne = false;
		if(coinDoubler.equipped) {
			coinDoubler.x = 100 * (hasOne ? 2 : 1);
			coinDoubler.y = 75;
			coinDoubler.displayLogo(0.5);
			hasOne = true;
		}
		if(speedIncreaser.equipped) {
			speedIncreaser.x = 100 * (hasOne ? 2 : 1);
			speedIncreaser.y = 75;
			speedIncreaser.displayLogo(0.5);
			hasOne = true;
		}
		if(doubleJumper.equipped) {
			doubleJumper.x = 100 * (hasOne ? 2 : 1);
			doubleJumper.y = 75;
			doubleJumper.displayLogo(0.5);
			hasOne = true;
		}
		if(intangibilityTalisman.equipped) {
			intangibilityTalisman.x = 100 * (hasOne ? 2 : 1);
			intangibilityTalisman.y = 75;
			intangibilityTalisman.displayLogo(0.5);
			hasOne = true;
		}
		if(secondLife.equipped) {
			secondLife.x = 100 * (hasOne ? 2 : 1);
			secondLife.y = 75;
			secondLife.displayLogo(0.5);
			hasOne = true;
		}
		/* score + coins */
		c.fillStyle = "rgb(100, 100, 100)";
		c.font = "20px monospace";
		c.textAlign = "left";
		c.fillText("Score: " + p.score, 10, 790);
		c.textAlign = "right";
		c.fillText("Coins: " + p.coins, 790, 790);
	}
	else if(game.screen === "death") {
		c.fillStyle = "rgb(200, 200, 200)";
		c.fillRect(0, 0, 800, 800);
		/* title */
		c.fillStyle = "rgb(100, 100, 100)";
		c.font = "50px cursive";
		c.textAlign = "center";
		c.fillText("You Died", 400, 200);
		/* body text */
		c.font = "30px monospace";
		c.textAlign = "left";
		switch(p.deathCause) {
			case "laser":
				c.fillText("You were shot by a laser", 200, 300);
				break;
			case "acid":
				c.fillText("You fell into a pool of acid", 200, 300);
				break;
			case "boulder":
				c.fillText("You were crushed by a boulder", 200, 300);
				break;
			case "spinnyblades":
				c.fillText("You were sliced in half", 200, 300);
				break;
			case "pirhanas":
				c.fillText("You were bitten by a pirhana", 200, 300);
				break;
			case "pacmans":
				c.fillText("You were killed by a pacman", 200, 300);
				break;
			case "rocket":
				c.fillText("You were hit with a rocket", 200, 300);
				break;
			case "spikeball":
				c.fillText("You were taken out by a spikeball", 200, 300);
				break;
			case "spikewall":
				c.fillText("You were impaled on a wall of spikes", 200, 300);
				break;
			case "fall":
				c.fillText("You fell way too far", 200, 300);
				break;
		}
		p.highScore = Math.max(p.score, p.highScore);
		c.fillText("You got a score of " + p.score + " points", 200, 350);
		c.fillText("Your highscore is " + p.highScore + " points", 200, 400);
		c.fillText("You collected " + p.coins + " coins", 200, 450);
		c.fillText("You now have " + p.totalCoins + " coins", 200, 500);
		/* buttons */
		homeFromDeath.display();
		homeFromDeath.mouseOver = homeFromDeath.hasMouseOver();
		homeFromDeath.checkForClick();
		retryButton.display();
		retryButton.mouseOver = retryButton.hasMouseOver();
		retryButton.checkForClick();
	}
	else if(game.screen === "shop") {
		c.fillStyle = "rgb(200, 200, 200)";
		c.fillRect(0, 0, 800, 800);
		/* title */
		c.font = "50px cursive";
		c.fillStyle = "rgb(100, 100, 100)";
		c.textAlign = "center";
		c.fillText("Shop", 400, 100);
		/* coin counter */
		c.font = "20px cursive";
		c.fillStyle = "rgb(255, 255, 0)";
		c.fillText("coins: " + p.totalCoins, 400, 150);
		/* items */
		coinDoubler.displayLogo(1);
		speedIncreaser.displayLogo(1);
		doubleJumper.displayLogo(1);
		intangibilityTalisman.displayLogo(1);
		secondLife.displayLogo(1);
		secondItem.displayLogo(1);

		coinDoubler.displayInfo();
		speedIncreaser.displayInfo();
		doubleJumper.displayInfo();
		intangibilityTalisman.displayInfo();
		secondLife.displayInfo();
		secondItem.displayInfo();

		coinDoubler.displayPopup();
		speedIncreaser.displayPopup();
		doubleJumper.displayPopup();
		intangibilityTalisman.displayPopup();
		secondLife.displayPopup();
		/* home button */
		homeFromShop.display();
		homeFromShop.mouseOver = homeFromShop.hasMouseOver();
		homeFromShop.checkForClick();
	}
	else if(game.screen === "achievements") {
		c.fillStyle = "rgb(200, 200, 200)";
		c.fillRect(0, 0, 800, 800);
		/* title */
		c.fillStyle = "rgb(100, 100, 100)";
		c.font = "50px cursive";
		c.textAlign = "center";
		c.fillText("Achievements", 400, 100);
		/* achievements */
		var achievements = [achievement1, achievement2, achievement3, achievement4, achievement5, achievement6, achievement7, achievement8, achievement9];
		for(var i = 0; i < achievements.length; i ++) {
			achievements[i].displayLogo();
		}
		for(var i = 0; i < achievements.length; i ++) {
			achievements[i].displayInfo();
		}
		/* home button */
		homeFromAchievements.display();
		homeFromAchievements.mouseOver = homeFromAchievements.hasMouseOver();
		homeFromAchievements.checkForClick();
	}

	var achievements = [achievement1, achievement2, achievement3, achievement4, achievement5, achievement6, achievement7, achievement8, achievement9];
	for(var i = 0; i < achievements.length; i ++) {
		achievements[i].checkProgress();
	}
	/* chat messages */
	for(var i = game.chatMessages.length - 1; i >= 0; i --) {
		game.chatMessages[i].display((game.chatMessages.length - i + 1) * 40 - 40);
		if(game.chatMessages[i].time <= 0) {
			game.chatMessages.splice(i, 1);
			i --;
			continue;
		}
		if(game.screen !== "play" && !(game.chatMessages[i].col === "rgb(255, 255, 0)")) {
			game.chatMessages.splice(i, 1);
			continue;
		}
	}

	utilities.frameCount ++;
	pastWorldY = p.worldY;
	utilities.pastInputs.update();
};
window.setInterval(doByTime, 1000 / FPS);
