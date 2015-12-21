var canvas;
var ctx;
var calculate;
var clear;
var tourHelper;
var tour;
var best;

window.addEventListener("load",function(){onLoad();sizeCanvas();});
window.addEventListener("resize",sizeCanvas);

function onLoad() {
	canvas = document.getElementById("canvas");
	calculate = document.getElementById("calculate");
	clear = document.getElementById("clear");
	ctx = canvas.getContext("2d");
	canvas.addEventListener("mousedown",function(event){addCity(event);});
	calculate.addEventListener("mousedown",function(){run();});
	clear.addEventListener("mousedown",function(){clearAll();});
	tourHelper = new TourHelper();
}

function sizeCanvas() {
	var w = window.innerWidth;
	if(w > 900)
		w = 900;
	var h = Math.min(window.innerHeight, w / 2);
	canvas.width = w;
	canvas.height = h;
	tourHelper = new TourHelper();
}

function addCity(event) {
	var radius = 4
	var xpos = event.clientX - canvas.getBoundingClientRect().left - radius / 2;
	var ypos = event.clientY - canvas.getBoundingClientRect().top - radius;
	ctx.beginPath();
	ctx.arc(xpos,ypos,radius,0,2*Math.PI);
	ctx.fillStyle = "#FF0000";
	ctx.fill();
	tourHelper.addCity(new City(xpos,ypos));
	best = null;
}

function run() {
	for(j = 0; j < 10; j++) {
		var temp = 10000;
		var coolingRate = 0.0001;

		var currentSolution = new Tour();
		currentSolution.generateTour(tourHelper);
		best = best == undefined || best == null ? new Tour(currentSolution.tour.slice(0)) : best;

		while(temp > 1) {

			var newSolution = new Tour(currentSolution.tour.slice(0));
			var tourPos1 = Math.floor(Math.random() * newSolution.tour.length);
			var tourPos2 = Math.floor(Math.random() * newSolution.tour.length);
			while(tourPos2 == tourPos1) {
				var tourPos2 = Math.floor(Math.random() * newSolution.tour.length);
			}

			var citySwap1 = newSolution.getCity(tourPos1);
			var citySwap2 = newSolution.getCity(tourPos2);

			newSolution.setCity(tourPos2,citySwap1);
			newSolution.setCity(tourPos1,citySwap2);

			var currentE = currentSolution.getDistance();
			var newE = newSolution.getDistance();

			if(acceptProb(currentE,newE,temp) > Math.random()) {
				currentSolution = new Tour(newSolution.tour);
			}

			if(currentSolution.getDistance() < best.getDistance()) {
				best = new Tour(currentSolution.tour.slice(0));
				best.distance = 0;
			}

			temp *= 1 - coolingRate;
		}
	}

	best.drawMap(ctx,canvas);
}

function clearAll() {
	ctx.clearRect(0,0,canvas.width,canvas.height);
	tourHelper.clear();
	best == null;
}

function acceptProb(energy,newEnergy,temp) {
	if(energy < newEnergy)
		return 1;
	return Math.exp((energy - newEnergy) / temp);
}

Object.prototype.clone = Array.prototype.clone = function() {
	if (Object.prototype.toString.call(this) === '[object Array]') {
		var clone = [];
		for (var i=0; i<this.length; i++)
			clone[i] = this[i].clone();

		return clone;
	} 
	else if (typeof(this)=="object") {
		var clone = {};
		for (var prop in this)
			if (this.hasOwnProperty(prop))
				clone[prop] = this[prop].clone();

		return clone;
	}
	else
		return this;
}
