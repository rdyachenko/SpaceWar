var arrPiston = [];
var arrEnemy = [];
var arrKeyCodes = [];
var ship;
var enemyRect = {};

var arrPiv = [];
var arrBang = [];

var canvas;
var context;

var start = false;
var animation = false;
var enemiesSpeed = 5;

var resolution = { x: 1024, y: 768 };

var dX = 1;
var dY = 1;
var dS = 1;

var dYBack = 0;

var responseForRetry;

var shipPic = new Image();
var enemyPic = new Image();
var starsPic = new Image();

function drawEnemy(context, enemy) {
	if (!enemyPic.src)
		enemyPic.src = 'images/enemy.png';
	context.drawImage(enemyPic, enemy.x * dX, enemy.y * dY, enemy.s * dS, enemy.s * dS);
}

function drawShip(context, ship) {
	if (!shipPic.src)
		shipPic.src = 'images/ship.png';
	context.drawImage(shipPic, ship.x * dX, ship.y * dY, ship.s * dS, ship.s * dS);
	//context.fill();
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
	context.fillText(text, resolution.x / 2 * dY, resolution.y / 2 * dY);
}

function init() {
	dX = canvas.width / (resolution.x + 1);
	dY = canvas.height / (resolution.y + 1);
	dS = Math.min(dX, dY);
	
	enemyRect = { x: 0, y: 0, w: 0, h: 0 };

	arrPiston = [];

	render();
}

function render() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.drawImage(starsPic, 0, dYBack - canvas.height, canvas.width, canvas.height);
	context.drawImage(starsPic, 0, dYBack, canvas.width, canvas.height);

	if (dYBack >= canvas.height)
		dYBack = 0;

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

function PlayBang() {
	var bang;
	if (arrBang)
		bang = arrBang.find(function (a) {
			return a.ended;
		})
	if (!bang) {
		bang = new Audio('audio/bang.mp3');
		arrBang.push(bang);
	}
	bang.play();
}

function PlayPiv() {
	var piv;
	if (arrPiv)
		piv = arrPiv.find(function (a) {
			return a.ended;
		})
	if (!piv) {
		piv = new Audio('audio/piv.mp3');
		arrPiv.push(piv);
	}
	piv.play();
}

function animate(canvas, context, startTime, makeShot, enemyKilled, showScore) {
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
				enemyKilled(function () { });
				arrPiston.splice(i, 1);
				arrEnemy.splice(index, 1);

				PlayBang();
			}
		}
		else
			arrPiston.splice(i, 1);
	}

	for (var i = 0; i < arrKeyCodes.length; i++) {
		switch (arrKeyCodes[i]) {
			case 32:

				if (curentTime - pifTime >= ship.reloadTime) {
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
						PlayPiv();
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

	if (arrEnemy.length > 0){
		for (var i = 0; i < arrEnemy.length; i++) {
			arrEnemy[i].y += speedY / 100 * enemiesSpeed;
			arrEnemy[i].x += arrEnemy[i].dx;
			if (arrEnemy[i].x <= arrEnemy[i].minX || arrEnemy[i].x + arrEnemy[i].s >= arrEnemy[i].maxX)
				arrEnemy[i].dx *= -1;
		}
		enemyRect.y += speedY / 100 * enemiesSpeed;
	}

	dYBack += speedY * ship.speed / 10;

	if (curentTime - scoreTime > 1000) {
		scoreTime = curentTime;
		showScore(DisplayScore);
	}

	calcEnemyRect();

	render();

	if (animation) {
		// request new frame
		requestAnimationFrame(function () {
			animate(canvas, context, curentTime, makeShot, enemyKilled, showScore);
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
				maxX = enemy.x;
			if (maxY < enemy.y)
				maxY = enemy.y;
		}
		enemyRect.x = minX;
		enemyRect.y = minY;
		enemyRect.w = maxX + arrEnemy[0].s - minX;
		enemyRect.h = maxY + arrEnemy[0].s - minY;
	}
}

window.addEventListener('load', load);
window.addEventListener('resize', resize);

function resize() {
	var cc = document.getElementById("field");

	var ddx = window.innerWidth / resolution.x;
	var ddy = Math.min(window.innerHeight / resolution.y, ddx);

	cc.width = resolution.x * ddx;
	cc.height = resolution.y * ddy;

	/*cc.style.width = window.innerWidth + "px";
	cc.style.height = window.innerHeight + "px";*/
}

function load() {
	canvas = document.getElementById('field');

	/*if (window.innerWidth < resolution.x) {
		var ddx = window.innerWidth / resolution.x;
		var ddy = Math.min(window.innerHeight / resolution.y, ddx);

		canvas.width = resolution.x * ddx;
		canvas.height = resolution.y * ddy;
	}*/

	context = canvas.getContext('2d');
}

var app = angular.module('myApp', []);
app.controller('myCtrl', function ($scope, $http) {

	starsPic.src = 'images/stars.png';
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
				function (enemyKilled) {
					$http.post("/api/SpaceWar/EnemyKilled").success(function () {
						enemyKilled();
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
			$http.get("/api/SpaceWar/Level")
			.success(function (response) {
				Level(response);
			});
			document.getElementById('nextLevel').blur();
		}

		$scope.retryClick = function () {
			Level(responseForRetry);
			document.getElementById('retry').blur();
		}
});

function Level(response) {

	responseForRetry = JSON.parse(JSON.stringify(response));
	arrEnemy = response.enemies.enemies.slice();

	calcEnemyRect();

	for (var i = 0; i < arrEnemy.length; i++) {
		var enemy = arrEnemy[i];
		enemy.maxX = resolution.x - enemyRect.w - enemyRect.x + enemy.x + enemy.s;
		enemy.minX = enemy.x - enemyRect.x;
	}

	ship = {
		x: response.ship.x,
		y: response.ship.y,
		s: response.ship.s,
		speed: response.ship.speed,
		reloadTime: response.ship.reloadTime
	}

	enemiesSpeed = response.enemies.speed;

	var info = document.getElementById('info2');
	info.textContent = "Enemies Speed: " + enemiesSpeed +
						"; Ship Speed: " + ship.speed +
						"; Ship reload time: " + ship.reloadTime;

	init();
}
