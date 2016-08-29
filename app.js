var canvasEl = document.querySelector('canvas');
var SNAKE_COLOR = 'orangered';

canvasEl.style.backgroundColor = 'palegreen';
canvasEl.style.display = 'block';
canvasEl.width = 500; 		// Höhe und breite muss im JavaScript oder direkt im Tag deffiniert werden
canvasEl.height =  500;
canvasEl.style.margin = '0 auto';

var context = canvasEl.getContext('2d');
// context.fillStyle = 'orangered';
// context.fillRect(0, 0, 250, 250);

var GRID_SIZE = 20;

function drawGrid(){

	for(var i = GRID_SIZE; i < canvasEl.width; i += GRID_SIZE){
		context.strokeStyle = 'white';
		context.beginPath();
		//				x, y
		context.moveTo(i - 0.5, 0);
		context.lineTo(i - 0.5, canvasEl.height);
		context.closePath();
		context.stroke();
	}

	for(var i = GRID_SIZE; i < canvasEl.height; i += GRID_SIZE){
		context.strokeStyle = 'white';
		context.beginPath();
		//				x, y
		context.moveTo(0, i - 0.5);
		context.lineTo(canvasEl.width, i - 0.5);
		context.closePath();
		context.stroke();
	}
}

// Input handling

var UP = 38;
var RIGHT = 39;
var DOWN = 40;
var LEFT = 37;
var PAUSE = 32;
var snakeDirection = RIGHT;

window.addEventListener('keyup', function(event){
	switch (event.keyCode){
		case UP:
			snakeDirection = UP;
			break;
		case DOWN:
			snakeDirection = DOWN;
			break;
		case LEFT:
			snakeDirection = LEFT;
			break;
		case RIGHT:
			snakeDirection = RIGHT;
			break;
		case PAUSE:
			snakeDirection = PAUSE;
			break;
		default:
			break;
	}
})

var SNAKE = [
	{ // Footer
		x: 0,
		y: 0
	},
	{
		x: GRID_SIZE,
		y: 0
	},
	{
		x: GRID_SIZE * 2,
		y: 0
	},
	{ // Head
		x: GRID_SIZE * 3,
		y: 0
	}
];


function randomX(){
	var rand = Math.random();
	return Math.floor((canvasEl.width / GRID_SIZE) * rand) * GRID_SIZE;
}

function randomY(){
	var rand = Math.random();
	return Math.floor((canvasEl.height / GRID_SIZE) * rand) * GRID_SIZE;
}

var FOOD = {
	x: randomX(),
	y: randomY()
};


var gameSpeed = 250;
function gameManager(){
	context.clearRect(0, 0, canvasEl.width, canvasEl.height);

	var newHead = SNAKE.shift();
	var oldHead = SNAKE[SNAKE.length - 1];

	if(snakeDirection === RIGHT){
		newHead.x = oldHead.x + GRID_SIZE;
		newHead.y = oldHead.y;
	} else if (snakeDirection === LEFT){
		newHead.x = oldHead.x - GRID_SIZE;
		newHead.y = oldHead.y;
	} else if(snakeDirection === UP){
		newHead.x = oldHead.x;
		newHead.y = oldHead.y - GRID_SIZE;
	} else if(snakeDirection === DOWN){
		newHead.x = oldHead.x;
		newHead.y = oldHead.y + GRID_SIZE;
	} else if(snakeDirection === PAUSE){
		clearInterval(gameLoop);
	}

	if (newHead.x + GRID_SIZE > canvasEl.width){
		newHead.x = 0;
	}
	if (newHead.x < 0) {
		newHead.x = canvasEl.width - GRID_SIZE;
	}
	if (newHead.y + GRID_SIZE > canvasEl.height){
		newHead.y = 0;
	}
	if( newHead.y < 0){
		newHead.y = canvasEl.height - GRID_SIZE;
	}

	SNAKE.push(newHead);

	// AABB Collision Detection (Bounding Box Collision)
	if (newHead.x < (FOOD.x + GRID_SIZE / 2) && newHead.x + GRID_SIZE > (FOOD.x + GRID_SIZE / 2)) {
		if (newHead.y < (FOOD.y + GRID_SIZE / 2) && newHead.y + GRID_SIZE > (FOOD.y + GRID_SIZE / 2)){
			var newPart = {
				x: SNAKE[0].x,
				y: SNAKE[0].y
			};	

			SNAKE.unshift(newPart);

			FOOD = {
				x: randomX(),
				y: randomY()
			};

			if (gameSpeed > 80) {
				clearInterval(gameLoop);
				gameSpeed -= 20;
				gameLoop = setInterval(gameManager, gameSpeed);	
			}


		}
	}
 


	context.fillStyle = SNAKE_COLOR;
	SNAKE.forEach(function(snakePart){
		context.fillRect(snakePart.x, snakePart.y, GRID_SIZE, GRID_SIZE);
	})

	drawGrid();

	// Essen zeichnen

	context.fillStyle = 'purple';
	context.beginPath();
	context.arc(
		FOOD.x + GRID_SIZE / 2,
		FOOD.y + GRID_SIZE / 2,
		GRID_SIZE / 3, // Radius
		0, // Start Radiant
		2 * Math.PI, // End Radiant
		false // Clockwise
	);
	context.closePath();
	context.fill();
}

var gameLoop = setInterval(gameManager, gameSpeed);







