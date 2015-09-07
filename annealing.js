function City(x,y) {
	this.x = x;
	this.y = y;
}

City.prototype.distanceTo = function(other) {
	var dx = Math.abs(this.x - other.x);
	var dy = Math.abs(this.y - other.y);
	return Math.sqrt(dx * dx + dy * dy);
}

City.prototype.toString = function() {
	return this.x + ", " + this.y;
}

/////////////////

function TourHelper() {
	this.destinations = [];
}

TourHelper.prototype.addCity = function(cityAdd) {
	this.destinations.push(cityAdd);
}

TourHelper.prototype.getCity = function(index) {
	return this.destinations[i];
}

TourHelper.prototype.cityCount = function() {
	return this.destinations.length;	
}

TourHelper.prototype.clear = function() {
	this.destinations = [];
}

/////////////////

function Tour(exampleTour) {
	this.distance = 0;
	if(exampleTour != undefined) {
		this.tour = exampleTour;
	} else {
		var array = [];
		for(i = 0; i < TourHelper.length; i++) {
			array.push(null);
		}
		this.tour = array;
	}
}

Tour.prototype.generateTour = function(cities) {
	for(i = 0; i < cities.destinations.length; i++) {
		this.setCity(i,cities.getCity(i));
	}
	this.tour = shuffleArray(this.tour);
	this.distance = 0;
}

Tour.prototype.getCity = function(index) {
	return this.tour[index];
}

Tour.prototype.setCity = function(index,city) {
	this.tour[index] = city;
	this.distance = 0;
}

Tour.prototype.getDistance = function() {
	if(this.distance == 0) {
		var tourDistance = 0;
		for(i = 0; i < this.tour.length; i++) {
			var fromCity = this.getCity(i);
			if(i + 1 < this.tour.length) {
				var toCity = this.getCity(i + 1);
			} else {
				var toCity = this.getCity(0);
			}
			tourDistance += fromCity.distanceTo(toCity);
		}
		this.distance = tourDistance;
	}
	return this.distance;
}

Tour.prototype.drawMap = function(ctx,canvas) {
	ctx.clearRect(0,0,canvas.width,canvas.height);
	ctx.fillStyle = "#FF0000";
	for(i = 0; i < this.tour.length; i++) {
		ctx.beginPath();
		ctx.arc(this.tour[i].x,this.tour[i].y,4,0,2*Math.PI);
		ctx.fill();
	}
	ctx.strokeStyle = "#33CC33";
	ctx.beginPath();
	ctx.moveTo(this.tour[0].x,this.tour[0].y);
	for(i = 1; i < this.tour.length; i++) {
		ctx.lineTo(this.tour[i].x,this.tour[i].y)
	}
	ctx.lineTo(this.tour[0].x,this.tour[0].y);
	ctx.stroke();
}

Tour.prototype.toString = function() {
	var output = "";
	for(i = 0; i < this.tour.length; i++) {
		output += "(" + this.tour[i] + ") ";
	}
	return output;
}

//Shuffles the array
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

//This is an experiment of simulated annealing and is totally based off http://www.theprojectspot.com/tutorial-post/simulated-annealing-algorithm-for-beginners/6