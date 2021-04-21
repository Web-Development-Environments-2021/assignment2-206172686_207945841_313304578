var context;
var pacman_position = new Object();
var board;
var score;
var amount_of_balls_remain;
var pac_color;
var start_time;
var time_remain;
var interval;

const MIN_BALLS_AMOUNT = 50;
const MAX_BALLS_AMOUNT = 90;
const MIN_TIME_SECONDS = 60;
const MIN_MONSTERS_AMOUNT = 1
const MAX_MONSTERS_AMOUNT = 4
const WALL = 4
const FOOD_5_POINTS = 100
const FOOD_15_POINTS = 101
const FOOD_25_POINTS = 102
const PACMAN = 2
const EMPTY_CELL = 0
const LEFT_ARROW = 37
const UP_ARROW = 38
const RIGHT_ARROW = 39
const DOWN_ARROW = 40

const LEFT_MOVE = 1
const RIGHT_MOVE = 2
const UP_MOVE = 3
const DOWN_MOVE = 4

const COLS = 10
const ROWS = 10 

var TOTAL_FOOD_AMOUNT = 50
var BALL_5_COLOR = "#0000ff"
var BALL_15_COLOR = "#ff0000"
var BALL_25_COLOR = "#00b33c"
var TOTAL_TIME = 120
var MONSTERS_AMOUNT = 2

$(document).ready(function() {
	context = canvas.getContext("2d");
	
});

document.getElementById("startGameBtn").onclick = function(){
	Start();
};

document.getElementById("settingsRandomValuesBtn").onclick = function(){
	numOfBalls.value = getRandomInt(MIN_BALLS_AMOUNT, MAX_BALLS_AMOUNT)
	ball5color.value = getRandomColor()
	ball15color.value = getRandomColor()
	ball25color.value = getRandomColor()
	totalTime.value = getRandomInt(MIN_TIME_SECONDS, MIN_TIME_SECONDS * 10)
	monstersAmount.value = getRandomInt(MIN_MONSTERS_AMOUNT, MAX_MONSTERS_AMOUNT)
	// TODO: default keys of
};

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomColor() {
	var letters = '0123456789ABCDEF';
	var color = '#';
	for (var i = 0; i < 6; i++) {
	  color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
  }

window.addEventListener("keydown", function(e) {
    if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, false);

function Start() {
	board = new Array();
	score = 0;
	pac_color = "yellow";
	var cnt = ROWS * COLS;
	var food_remain = TOTAL_FOOD_AMOUNT;
	var pacman_remain = 1;
	start_time = new Date();
	amount_of_balls_remain = TOTAL_FOOD_AMOUNT

	food_5_points_remain = ~~(TOTAL_FOOD_AMOUNT * 0.6)
	food_15_points_remain = ~~(TOTAL_FOOD_AMOUNT * 0.3)
	food_25_points_remain = TOTAL_FOOD_AMOUNT - food_5_points_remain - food_15_points_remain

	for (var i = 0; i < ROWS; i++) {
		board[i] = new Array();
		//put obstacles in (i=3,j=3) and (i=3,j=4) and (i=3,j=5), (i=6,j=1) and (i=6,j=2)
		for (var j = 0; j < COLS; j++) {
			if (
				(i == 3 && j == 3) ||
				(i == 3 && j == 4) ||
				(i == 3 && j == 5) ||
				(i == 6 && j == 1) ||
				(i == 6 && j == 2)
			) {
				board[i][j] = WALL;
			} else {
				var randomNum = Math.random();
				// Where to put food
				if (randomNum <= (1.0 * food_remain) / cnt) {
					food_remain--;

					// Random which food type based on amount of each type remain
					food_type_index = ~~(Math.random() * (food_5_points_remain + food_15_points_remain + food_25_points_remain))
					if (food_type_index < food_5_points_remain) {
						board[i][j] = FOOD_5_POINTS;
						food_5_points_remain--;
					} else if (food_type_index < food_5_points_remain + food_15_points_remain) {
						board[i][j] = FOOD_15_POINTS;
						food_15_points_remain--;
					} else {
						board[i][j] = FOOD_25_POINTS;
						food_25_points_remain--;
					}
					// There to put pacman
				} else if (randomNum < (1.0 * (pacman_remain + food_remain)) / cnt) {
					pacman_position.i = i;
					pacman_position.j = j;
					pacman_remain--;
					board[i][j] = PACMAN;
				} else {
					board[i][j] = EMPTY_CELL;
				}
				cnt--;
			}
		}
	}
	while (food_remain > 0) {
		var emptyCell = findRandomEmptyCell(board);
		if (food_5_points_remain > 0) {
			board[emptyCell[0]][emptyCell[1]] = FOOD_5_POINTS;
			food_5_points_remain--;
		} else if (food_15_points_remain > 0) {
			board[emptyCell[0]][emptyCell[1]] = FOOD_15_POINTS;
			food_15_points_remain--
		} else {
			board[emptyCell[0]][emptyCell[1]] = FOOD_25_POINTS;
			food_25_points_remain--;
		}
		food_remain--;
	}

	keyDown = -1;
	addEventListener(
		"keydown",
		function(e) {
			keyDown = e.keyCode
		},
		false
	);
	// addEventListener(
	// 	"keyup",
	// 	function(e) {
	// 		keysDown[e.keyCode] = false;
	// 	},
	// 	false
	// );

	interval = setInterval(UpdatePosition, 250);
}

function findRandomEmptyCell(board) {
	var i = Math.floor(Math.random() * ROWS);
	var j = Math.floor(Math.random() * COLS);
	while (board[i][j] != EMPTY_CELL) {
		i = Math.floor(Math.random() * ROWS);
		j = Math.floor(Math.random() * COLS);
	}
	return [i, j];
}

function GetKeyPressed() {
	if (keyDown == UP_ARROW) {
		return UP_MOVE;
	}
	if (keyDown == DOWN_ARROW) {
		return DOWN_MOVE;
	}
	if (keyDown == LEFT_ARROW) {
		return LEFT_MOVE;
	}
	if (keyDown == RIGHT_ARROW) {
		return RIGHT_MOVE;
	}
}

function Draw() {
	canvas.width = canvas.width; //clean board
	lblScore.value = score;
	lblTime.value = time_remain;
	for (var i = 0; i < COLS; i++) {
		for (var j = 0; j < ROWS; j++) {
			var center = new Object();
			center.x = i * 60 + 30;
			center.y = j * 60 + 30;
			if (board[i][j] == PACMAN) {
				context.beginPath();
				context.arc(center.x, center.y, 30, 0.15 * Math.PI, 1.85 * Math.PI); // half circle
				context.lineTo(center.x, center.y);
				context.fillStyle = pac_color; //color
				context.fill();
				context.beginPath();
				context.arc(center.x + 5, center.y - 15, 5, 0, 2 * Math.PI); // circle
				context.fillStyle = "black"; //color
				context.fill();
			} else if (board[i][j] == FOOD_5_POINTS) {
				context.beginPath();
				context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
				context.fillStyle = BALL_5_COLOR; //color
				context.fill();
			} 
			else if (board[i][j] == FOOD_15_POINTS) {
				context.beginPath();
				context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
				context.fillStyle = BALL_15_COLOR; //color
				context.fill();
			}
			else if (board[i][j] == FOOD_25_POINTS) {
				context.beginPath();
				context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
				context.fillStyle = BALL_25_COLOR; //color
				context.fill();
			} else if (board[i][j] == WALL) {
				context.beginPath();
				context.rect(center.x - 30, center.y - 30, 60, 60);
				context.fillStyle = "grey"; //color
				context.fill();
			}
		}
	}
}

function UpdatePosition() {
	board[pacman_position.i][pacman_position.j] = EMPTY_CELL;
	var x = GetKeyPressed();
	if (x == UP_MOVE) {
		if (pacman_position.j > 0 && board[pacman_position.i][pacman_position.j - 1] != WALL) {
			pacman_position.j--;
		}
	}
	else if (x == DOWN_MOVE) {
		if (pacman_position.j < ROWS - 1  && board[pacman_position.i][pacman_position.j + 1] != WALL) {
			pacman_position.j++;
		}
	}
	else if (x == LEFT_MOVE) {
		if (pacman_position.i > 0 && board[pacman_position.i - 1][pacman_position.j] != WALL) {
			pacman_position.i--;
		}
	}
	else if (x == RIGHT_MOVE) {
		if (pacman_position.i < COLS - 1 && board[pacman_position.i + 1][pacman_position.j] != WALL) {
			pacman_position.i++;
		}
	}
	if (board[pacman_position.i][pacman_position.j] == FOOD_5_POINTS) {
		score += 5;
		amount_of_balls_remain--;
	} else if (board[pacman_position.i][pacman_position.j] == FOOD_15_POINTS) {
		score += 15;
		amount_of_balls_remain--;
	} else if (board[pacman_position.i][pacman_position.j] == FOOD_25_POINTS) {
		score += 25;
		amount_of_balls_remain--;
	}

	board[pacman_position.i][pacman_position.j] = PACMAN;
	var currentTime = new Date();
	time_elapsed = (currentTime - start_time) / 1000;
	time_remain = ~~(TOTAL_TIME - time_elapsed);
	if (score >= 20 && time_elapsed <= 10) {
		pac_color = "green";
	}
	if (amount_of_balls_remain == 0) {
		Draw();
		window.clearInterval(interval);
		window.alert("Game completed");
		
	} else if(time_remain == 0) {
		Draw();
		window.clearInterval(interval);
		window.alert("Game Over - you lost");
	} 
	else {
		Draw();
	}
}

document.getElementById("settings_form").onsubmit = function() {
	TOTAL_FOOD_AMOUNT = numOfBalls.value
	BALL_5_COLOR = ball5color.value
	BALL_15_COLOR = ball15color.value
	BALL_25_COLOR = ball25color.value
	TOTAL_TIME = ~~totalTime.value
	MONSTERS_AMOUNT = monstersAmount.value

	alert("Let's play!")
};
