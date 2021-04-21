var context;
var pacman_position = new Object();
var strawberry_position = new Object();
var board;
var score;
var amount_of_balls_remain;
var pac_color;
var start_time;
var time_remain;
var interval;

const TIME_BUNOS_SECONDS = 10
const MIN_BALLS_AMOUNT = 50;
const MAX_BALLS_AMOUNT = 90;
const MIN_TIME_SECONDS = 60;
const MIN_MONSTERS_AMOUNT = 1
const MAX_MONSTERS_AMOUNT = 4
const WALL = 4

STRAWBERRY_POINTS_VALUE = 50

const TIME_BUNOS = 201
const PILL = 202
const STRAWBERRY = 203

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


var current_lifes = 5
var TOTAL_FOOD_AMOUNT = 50
var BALL_5_COLOR = "#0000ff"
var BALL_15_COLOR = "#ff0000"
var BALL_25_COLOR = "#00b33c"
var TOTAL_TIME = 120
var MONSTERS_AMOUNT = 2

$(document).ready(function () {
	context = canvas.getContext("2d");
	timer = document.getElementById('timer');
	pill = document.getElementById('pill');
	strawberry = document.getElementById('strawberry');
});


document.getElementById("startGameBtn").onclick = function () {
	audio.play()
	Start();
};

document.getElementById("settingsRandomValuesBtn").onclick = function () {
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

window.addEventListener("keydown", function (e) {
	if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1) {
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

	var emptyCell = findRandomEmptyCell(board);
	board[emptyCell[0]][emptyCell[1]] = TIME_BUNOS;

	emptyCell = findRandomEmptyCell(board);
	board[emptyCell[0]][emptyCell[1]] = PILL;

	emptyCell = findRandomEmptyCell(board);
	board[emptyCell[0]][emptyCell[1]] = STRAWBERRY;

	strawberry_position.i = emptyCell[0];
	strawberry_position.j = emptyCell[1];
	strawberry_position.prev_value = EMPTY_CELL
	strawberry_position.is_alive = true

	keyDown = -1;
	addEventListener(
		"keydown",
		function (e) {
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

function Draw(move = RIGHT_MOVE) {
	canvas.width = canvas.width; //clean board
	lblScore.value = score;
	lblLifes.value = current_lifes;
	lblTime.value = time_remain;
	for (var i = 0; i < COLS; i++) {
		for (var j = 0; j < ROWS; j++) {
			var center = new Object();
			center.x = i * 60 + 30;
			center.y = j * 60 + 30;
			if (board[i][j] == PACMAN) {
				angle = 0
				if (move == RIGHT_MOVE) {
					mouth_angle = 0
					eye_position = {
						x: center.x + 5,
						y: center.y - 15
					}
				} else if (move == DOWN_MOVE) {
					mouth_angle = 0.5
					eye_position = {
						x: center.x + 20,
						y: center.y - 5
					}
				}
				else if (move == UP_MOVE) {
					mouth_angle = -0.5
					eye_position = {
						x: center.x + 20,
						y: center.y + 5
					}
				}
				else if (move == LEFT_MOVE) {
					mouth_angle = 1
					eye_position = {
						x: center.x + 5,
						y: center.y - 15
					}
				}
				context.beginPath();
				context.arc(center.x, center.y, 30, (mouth_angle + 0.15) * Math.PI, (mouth_angle + 1.85) * Math.PI); // half circle
				context.lineTo(center.x, center.y);
				context.fillStyle = pac_color; //color
				context.fill();
				context.beginPath();
				context.arc(eye_position.x, eye_position.y, 5, 0, 2 * Math.PI); // circle
				context.fillStyle = "black"; //color
				context.fill();
			} else if (board[i][j] == FOOD_5_POINTS) {
				context.beginPath();
				context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
				context.fillStyle = BALL_5_COLOR; //color
				context.fill();

				context.fillStyle = "white";
				context.font = "16px Arial";
				context.fillText("5", center.x - 5, center.y + 5);
			}
			else if (board[i][j] == FOOD_15_POINTS) {
				context.beginPath();
				context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
				context.fillStyle = BALL_15_COLOR; //color
				context.fill();
				context.fillStyle = "white";
				context.font = "16px Arial";
				context.fillText("15", center.x - 10, center.y + 5);
			}
			else if (board[i][j] == FOOD_25_POINTS) {
				context.beginPath();
				context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
				context.fillStyle = BALL_25_COLOR; //color
				context.fill();
				context.fillStyle = "white";
				context.font = "16px Arial";
				context.fillText("25", center.x - 10, center.y + 5);
			} else if (board[i][j] == WALL) {
				context.beginPath();
				context.rect(center.x - 30, center.y - 30, 60, 60);
				context.fillStyle = "grey"; //color
				context.fill();
			}
			else if (board[i][j] == TIME_BUNOS) {
				context.drawImage(timer, center.x - 20, center.y - 20, 35, 35);
			}
			else if (board[i][j] == PILL) {
				context.drawImage(pill, center.x - 20, center.y - 20, 35, 35);
			}
			else if (board[i][j] == STRAWBERRY && strawberry_position.is_alive) {
				context.drawImage(strawberry, center.x - 20, center.y - 20, 35, 35);
			}
		}
	}
}

function UpdatePosition() {
	board[pacman_position.i][pacman_position.j] = EMPTY_CELL;
	curr_move = GetKeyPressed()

	movePosition(pacman_position, curr_move);

	if (strawberry_position.is_alive) {
		board[strawberry_position.i][strawberry_position.j] = strawberry_position.prev_value;
		movePosition(strawberry_position, getRandomInt(1, 4));
		strawberry_position.prev_value = board[strawberry_position.i][strawberry_position.j]
		board[strawberry_position.i][strawberry_position.j] = STRAWBERRY;
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
	} else if (board[pacman_position.i][pacman_position.j] == TIME_BUNOS) {
		TOTAL_TIME += TIME_BUNOS_SECONDS
	} else if (board[pacman_position.i][pacman_position.j] == PILL) {
		current_lifes += 1
	} else if (board[pacman_position.i][pacman_position.j] == STRAWBERRY) {
		score += STRAWBERRY_POINTS_VALUE
		strawberry_position.is_alive = false
	}

	board[pacman_position.i][pacman_position.j] = PACMAN;
	var currentTime = new Date();
	time_elapsed = (currentTime - start_time) / 1000;
	time_remain = ~~(TOTAL_TIME - time_elapsed);
	if (amount_of_balls_remain == 0) {
		Draw(curr_move);
		window.clearInterval(interval);
		window.alert("Winner!!!");

	} else if (time_remain == 0) {
		Draw(curr_move);
		window.clearInterval(interval);
		window.alert("You are better than " + score + " Points!");
	}
	else {
		Draw(curr_move);
	}
}

document.getElementById("settings_form").onsubmit = function () {
	TOTAL_FOOD_AMOUNT = numOfBalls.value
	BALL_5_COLOR = ball5color.value
	BALL_15_COLOR = ball15color.value
	BALL_25_COLOR = ball25color.value
	TOTAL_TIME = ~~totalTime.value
	MONSTERS_AMOUNT = monstersAmount.value

	alert("Let's play!")
};
function movePosition(position, direction) {
	if (direction == UP_MOVE) {
		if (position.j > 0 && board[position.i][position.j - 1] != WALL) {
			position.j--;
		}
	}
	else if (direction == DOWN_MOVE) {
		if (position.j < ROWS - 1 && board[position.i][position.j + 1] != WALL) {
			position.j++;
		}
	}
	else if (direction == LEFT_MOVE) {
		if (position.i > 0 && board[position.i - 1][position.j] != WALL) {
			position.i--;
		}
	}
	else if (direction == RIGHT_MOVE) {
		if (position.i < COLS - 1 && board[position.i + 1][position.j] != WALL) {
			position.i++;
		}
	}
}

