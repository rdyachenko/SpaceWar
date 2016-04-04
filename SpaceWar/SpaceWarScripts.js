var arrPiston = [];
var arrEnemy = [];
var arrKeyCodes = [];
var ship;
var enemyRect = {};

var canvas;
var context;

var start = false;
var animation = false;

var resolution = { x: 1024, y: 768 };

var dX = 1;
var dY = 1;
var dS = 1;

function drawEnemy(context, enemy) {
		context.beginPath();
		context.rect(enemy.x * dX, enemy.y * dY, enemy.s * dS, enemy.s * dS);
		context.closePath();
		context.fill();
}

function drawShip(context, ship) {
		context.beginPath();
		context.rect(ship.x * dX, ship.y * dY, ship.s * dS, ship.s * dS);
		context.closePath();
		context.fill();
}

function drawPiston(context, piston) {
		context.beginPath();
		context.rect(piston.x * dX, piston.y * dY, 3 * dS, 3 * dS);
		context.closePath();
		context.fill();
}

function drawText(context, text, color, size) {
	context.font = size + "px Arial";
	context.fillStyle = color;
	context.textAlign = "center";
	context.fillText(text, canvas.width / 2 * dY, canvas.height / 2 * dY);
}

function init() {
	var shipSpeed = document.getElementById('shipSpeed').value;

	dX = canvas.width / (resolution.x + 1);
	dY = canvas.height / (resolution.y + 1);
	dS = Math.min(dX, dY);
	
	enemyRect = { x: 0, y: 0, w: 0, h: 0 };

	ship = {
		x: resolution.x / 2,
		y: resolution.y - 20,
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

	if (ship) {
		var shipPoint = { x: ship.x + ship.s / 2, y: ship.y };
		if (enemyRect.y + enemyRect.h > shipPoint.y) {
			drawText(context, "Fail!", "red", 50);
			animation = false;
			arrEnemy.splice(0, arrEnemy.length);
		}
	}
	
	/*context.beginPath();
	context.rect(enemyRect.x * dX, enemyRect.y * dY, enemyRect.w * dX, enemyRect.h * dY);
	context.closePath();*/

	context.stroke();
}

window.onkeydown = function (e) {
	var exist = false;
	for (var i = 0; i < arrKeyCodes.length; i++) {
		if(arrKeyCodes[i] == e.keyCode){
			exist = true;
			break;
		}

	}
	if (!exist) {
		arrKeyCodes.push(e.keyCode);
	}
}

window.onkeyup = function (e) {
	for (var i = 0; i < arrKeyCodes.length; i++) {
		if (arrKeyCodes[i] == e.keyCode)
			arrKeyCodes.splice(i,1);
	}
}

var requestAnimationFrame = window.requestAnimationFrame || 
                            window.mozRequestAnimationFrame || 
                            window.webkitRequestAnimationFrame || 
                            window.msRequestAnimationFrame;

var pifTime = 0;
var scoreTime = 0;
function animate(canvas, context, startTime, makeShot, showScore) {
	// update
	var curentTime = (new Date()).getTime();
	var time = curentTime - startTime;

	var linearSpeed = 500;
	var reloadPistonTime = 20 * time / 1000;
	// pixels / second
	var speedY = linearSpeed * time / 1000;
	
	for (var i = 0; i < arrPiston.length; i++) {
		var piston = arrPiston[i];
		if (piston.y > 0) {
			piston.y -= speedY;

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

				if (curentTime - pifTime >= 200) {
					pifTime = (new Date()).getTime();
					var piston = {
						x: ship.x + ship.s / 2,
						y: ship.y,
					};

					makeShot(function () {
						pifTime = (new Date()).getTime();

						var piston = {
							x: ship.x + ship.s / 2,
							y: ship.y,
						};
						arrPiston.push(piston);
						var piv = new Audio("./audio/piv.mp3");
						piv.play();
					});
				}

				break;
			case 37://left
				if (ship.x >= 0)
					ship.x -= parseInt(ship.speed);
				break;
			case 39: //right
				if (ship.x + ship.s <= resolution.x)
					ship.x += parseInt(ship.speed);
				break;
			default:
				//alert(e.keyCode);
		}
	}

	var speed = document.getElementById('spinner').value;

	if (arrEnemy.length > 0){
		for (var i = 0; i < arrEnemy.length; i++) {
			arrEnemy[i].y += speedY / 100 * speed;
			arrEnemy[i].x += arrEnemy[i].dx;
			if (arrEnemy[i].x < arrEnemy[i].minX || arrEnemy[i].x + arrEnemy[i].s * 2 > arrEnemy[i].maxX)
				arrEnemy[i].dx *= -1;
		}
		enemyRect.y += speedY / 100 * speed;
	}

	if (curentTime - scoreTime > 1000) {
		scoreTime = curentTime;
		showScore(DisplayScore);
	}

	calcEnemyRect();

	render();

	if (animation) {
		// request new frame
		requestAnimationFrame(function () {
			animate(canvas, context, curentTime, makeShot, showScore);
		});
	}
}

function DisplayScore(score) {
	var info = document.getElementById('info');
	info.textContent = "ScoreCount: " + score.scoreCount + "; Level: " + score.level;
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

function calcEnemyRect() {
	if (arrEnemy.length > 0) {
		var minX = arrEnemy[0].x;
		var maxX = arrEnemy[0].x;
		var minY = arrEnemy[0].y;
		var maxY = arrEnemy[0].y;

		for (var i = 1; i < arrEnemy.length; i++) {
			var enemy = arrEnemy[i];
			if (minX > enemy.x)
				minX = enemy.x;
			if (minY > enemy.y)
				minY = enemy.y;
			if (maxX < enemy.x)
				maxX = enemy.x + enemy.s;
			if (maxY < enemy.y)
				maxY = enemy.y + enemy.s;
		}
		enemyRect.x = minX;
		enemyRect.y = minY;
		enemyRect.w = maxX - minX;
		enemyRect.h = maxY - minY;
	}
}

var app = angular.module('myApp', []);
app.controller('myCtrl', function ($scope, $http) {

		canvas = document.getElementById('field');
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight - 200;

		context = canvas.getContext('2d');

		$scope.startStopClick = function() {
			var btnStart = document.getElementById('start');

			if (start) {
				btnStart.textContent = "Start";
				start = false;
				animation = false;
			}
			else {
				btnStart.textContent = "Stop";
				start = true;
				animation = true;
				btnStart.blur();
				$http.post("/api/SpaceWar/StartGame", { someData: 16 });

				var startTime = (new Date()).getTime();
				animate(canvas, context, startTime, function (doShot) {
						$http.post("/api/SpaceWar/Shot").success(function () {
						doShot();
					});
				},
					function (showScore) {
						$http.get("/api/SpaceWar/Score").success(function (score) {
							showScore(score);
						});
					});
			}
		}

		$scope.nextLevelClick = function () {
			$http.get("/api/SpaceWar/EnemyPosition")
			.success(function (response) {

				arrEnemy = response.slice();

				calcEnemyRect();

				for (var i = 0; i < arrEnemy.length; i++) {
					var enemy = arrEnemy[i];
					enemy.maxX = resolution.x - enemyRect.w + enemy.x;
					enemy.minX = enemy.x - enemyRect.x;
				}

				init();
			});
		}
	});
