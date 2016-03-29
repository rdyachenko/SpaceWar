//window.addEventListener("load", init, true);

function drawEnemy(context, enemy) {
		context.beginPath();
		context.rect(enemy.x, enemy.y, enemy.s, enemy.s);
		context.closePath();
		context.fill();
}

function drawShip(context, ship) {
		context.beginPath();
		context.rect(ship.x, ship.y, ship.s, ship.s);
		context.closePath();
		context.fill();
}

function drawPiston(context, piston) {
		context.beginPath();
		context.rect(piston.x, piston.y, 3, 3);
		context.closePath();
		context.fill();
}

function drawText(context, text, color, size) {
	context.font = size + "px Arial";
	context.fillStyle = color;
	context.textAlign = "center";
	context.fillText(text, canvas.width/2, canvas.height/2);
}

var arrPiston = [];
var arrEnemy = [];
var arrKeyCodes = [];
var ship;
var enemyRect = {};

var canvas;
var context;

var start = false;
var animation = false;

function init() {
	var enemyCol = document.getElementById('enemyCol').value;
	var enemyRow = document.getElementById('ememyRow').value;
	var shipSpeed = document.getElementById('shipSpeed').value;
	
	enemyRect = {x: canvas.clientLeft + 1, y: canvas.clientTop + 70, w:canvas.width - 3, h: enemyRow * 30};

	ship = {
		x: canvas.width / 2,
		y: canvas.height - 20,
		s: 20,
		speed: shipSpeed
	}

	render();
}

function render() {
	context.clearRect(0, 0, canvas.width, canvas.height);

	var color = '#0000FF'
	context.strokeStyle = color;
	context.fillStyle = color;

	if (arrEnemy.length > 0)
		for (var i = 0; i < arrEnemy.length; i++)
			drawEnemy(context, arrEnemy[i]);
	
	color = 'green'
	context.strokeStyle = color;
	context.fillStyle = color;

	if(ship)
		drawShip(context, ship);

	if (arrPiston.length > 0) {
		color = 'red'
		context.strokeStyle = color;
		context.fillStyle = color;

		for (var i = 0; i < arrPiston.length; i++)
			drawPiston(context, arrPiston[i]);
	}

	if (arrEnemy.length == 0)
		drawText(context, "Winner!", "blue", 50);

	var shipPoint = { x: ship.x + ship.s / 2, y: ship.y };
	if (enemyRect.y + enemyRect.h > shipPoint.y) {
		drawText(context, "Fail!", "red", 50);
		animation = false;
		arrEnemy.splice(0, arrEnemy.length);
	}
	
	/*context.beginPath();
	context.rect(enemyRect.x, enemyRect.y, enemyRect.w, enemyRect.h);
	context.closePath();*/

	context.stroke();
}

window.onkeydown = function (e) {
	var info = document.getElementById('info');
	info.textContent = e.keyCode;

	var exist = arrKeyCodes.find(function (a) { return a == e.keyCode });
	if (!exist)
		arrKeyCodes.push(e.keyCode);
}

window.onkeyup = function (e) {
	var info = document.getElementById('info');
	info.textContent = e.keyCode;

	for (var i = 0; i < arrKeyCodes.length; i++) {
		if (arrKeyCodes[i] == e.keyCode)
			arrKeyCodes.splice(i,1);
	}
}

var requestAnimationFrame = window.requestAnimationFrame || 
                            window.mozRequestAnimationFrame || 
                            window.webkitRequestAnimationFrame || 
                            window.msRequestAnimationFrame;

function animate(canvas, context, startTime) {
	// update
	var curentTime = (new Date()).getTime();
	var time = curentTime - startTime;

	var linearSpeed = 500;
	// pixels / second
	var dY = linearSpeed * time / 1000;
	
	for (var i = 0; i < arrPiston.length; i++) {
		var piston = arrPiston[i];
		if (piston.y > 0) {
			piston.y -= dY;

			var enemy;
			if (InEnemy(piston, function (e) { index = e; })) {
				arrPiston.splice(i, 1);
				arrEnemy.splice(index, 1);
				var bang = new Audio("./audio/bang.mp3");
				bang.play();
			}
		}
		else
			arrPiston.splice(i, 1);
	}

	for (var i = 0; i < arrKeyCodes.length; i++) {
		switch (arrKeyCodes[i]) {
			case 32:
				var piston = {
					x: ship.x + ship.s / 2,
					y: ship.y,
				};

				arrPiston.push(piston);
				var piv = new Audio("./audio/piv.mp3");
				piv.play();

				for (var i = 0; i < arrKeyCodes.length; i++) {
					if (arrKeyCodes[i] == 32)
						arrKeyCodes.splice(i, 1);
				}
				break;
			case 37://left
				if (ship.x > 0)
					ship.x -= parseInt(ship.speed);
				break;
			case 39: //right
				if (ship.x + ship.s < canvas.width)
					ship.x += parseInt(ship.speed);
				break;
			default:
				//alert(e.keyCode);
		}
	}

	var speed = document.getElementById('spinner').value;

	if (arrEnemy.length > 0){
		for (var i = 0; i < arrEnemy.length; i++)
			arrEnemy[i].y += dY / 100 * speed;
		enemyRect.y += dY / 100 * speed;
	}

	render();

	if (animation) {
		// request new frame
		requestAnimationFrame(function () {
			animate(canvas, context, curentTime);
		});
	}
}

function InEnemy(piston, enemyOut) {
	var maxY = 0;

	for (var i = 0; i < arrEnemy.length; i++) {
		var enemy = arrEnemy[i];
		if(enemy.y > maxY){
			maxY = enemy.y;
			enemyRect.y = maxY + enemy.s - enemyRect.h;
		}
		
		if (piston.x > enemy.x
			&& piston.x < enemy.x + enemy.s
			&& piston.y > enemy.y
			&& piston.y < enemy.y + enemy.s) {
			enemyOut(i);
			return true;
		}
	}
	return false;
}

var app = angular.module('myApp', []);
app.controller('myCtrl', function ($scope, $http) {

	canvas = document.getElementById('field');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight - 200;

	context = canvas.getContext('2d');

	$scope.startStopClick = function() {
		var btnStart = document.getElementById('start');

		$http.get("/api/SpaceWar/EnemyPosition")
		.success(function (response) {

			if (arrEnemy.length == 0)
				arrEnemy = response.slice();
			
		});

		if (start) {
			btnStart.textContent = "Start";
			start = false;
			animation = false;
			init();
		}
		else {
			btnStart.textContent = "Stop";
			start = true;
			animation = true;
			btnStart.blur();
			init();
			var startTime = (new Date()).getTime();
			animate(canvas, context, startTime);
		}
	}
});
