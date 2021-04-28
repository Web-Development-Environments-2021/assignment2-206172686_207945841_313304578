// website



var context;
var pacman_position = new Object();
var strawberry_position = new Object();

var monster1_position = new Object();
monster1_position.is_alive = false
var monster2_position = new Object();
monster2_position.is_alive = false
var monster3_position = new Object();
monster3_position.is_alive = false
var monster4_position = new Object();
monster4_position.is_alive = false


var board;
var score;
var amount_of_balls_remain;
var pac_color;
var start_time;
var time_remain;
var interval;
var isShowingFireworks = false;
var k = "k";
var username_input;
var storaged_password;
var username;
var pass;


var is_slow_motion = false;
var count_steps = 0;

const COLUMNS = 15
const ROWS = 15

const TIME_BUNOS_SECONDS = 10
const MIN_BALLS_AMOUNT = 50;
const MAX_BALLS_AMOUNT = 90;
const MIN_TIME_SECONDS = 60;
const MIN_MONSTERS_AMOUNT = 1
const MAX_MONSTERS_AMOUNT = 4
const MONSTER_EAT_PENALTY = 10
const SLOW_MOTION_TIMEOUT = 3000

const STRAWBERRY_POINTS_VALUE = 50

const cellType = {
	EMPTY: 'EMPTY',
	FOOD_5_POINTS: 'FOOD_5_POINTS',
	FOOD_15_POINTS: 'FOOD_15_POINTS',
	FOOD_25_POINTS: 'FOOD_25_POINTS',
	PACMAN: 'PACMAN',
	TIME_BUNOS: 'TIME_BUNOS',
	PILL: 'PILL',
	STRAWBERRY: 'STRAWBERRY',
	WALL: 'WALL',
	MONSTER1: 'MONSTER1',
	MONSTER2: 'MONSTER2',
	MONSTER3: 'MONSTER3',
	MONSTER4: 'MONSTER4',
	SLOW_MOTION: 'SLOW_MOTION'
};

const FOOD_CELLS = [cellType.FOOD_5_POINTS, cellType.FOOD_15_POINTS, cellType.food_25_points_remain]
const MONSTER_CELLS = [cellType.MONSTER1, cellType.MONSTER2, cellType.MONSTER3, cellType.MONSTER4]
const NON_ACCESS_CELLS = [cellType.STRAWBERRY, cellType.WALL].concat(MONSTER_CELLS)

const monsters = [
	{
		position: monster1_position,
		cellType: cellType.MONSTER1,
		initial_i: 1,
		initial_j: 1,
	},
	{
		position: monster2_position,
		cellType: cellType.MONSTER2,
		initial_i: ROWS - 2,
		initial_j: COLUMNS - 2,
	},
	{
		position: monster3_position,
		cellType: cellType.MONSTER3,
		initial_i: ROWS - 2,
		initial_j: 1,
	},
	{
		position: monster4_position,
		cellType: cellType.MONSTER4,
		initial_i: 1,
		initial_j: COLUMNS - 2,
	},
];

const LEFT_MOVE = 1
const RIGHT_MOVE = 2
const UP_MOVE = 3
const DOWN_MOVE = 4

const DEFAULT_DOWN_KEY = 40
const DEFAULT_UP_KEY = 38
const DEFAULT_LEFT_KEY = 37
const DEFAULT_RIGHT_KEY = 39

KEYS_DATA = {
	"down": {
		keyCode: DEFAULT_DOWN_KEY,
		move: DOWN_MOVE,
	},
	"up": {
		keyCode: DEFAULT_UP_KEY,
		move: UP_MOVE,
	},
	"left": {
		keyCode: DEFAULT_LEFT_KEY,
		move: LEFT_MOVE,
	},
	"right": {
		keyCode: DEFAULT_RIGHT_KEY,
		move: RIGHT_MOVE,
	}
}

const TEMP_KEYS_DATA = {
	"down": {
		keyCode: DEFAULT_DOWN_KEY,
		is_waiting_for_key: false,
		move: DOWN_MOVE,
		button_id: "down_key"
	},
	"up": {
		keyCode: DEFAULT_UP_KEY,
		is_waiting_for_key: false,
		move: UP_MOVE,
		button_id: "up_key"
	},
	"left": {
		keyCode: DEFAULT_LEFT_KEY,
		is_waiting_for_key: false,
		move: LEFT_MOVE,
		button_id: "left_key"
	},
	"right": {
		keyCode: DEFAULT_RIGHT_KEY,
		is_waiting_for_key: false,
		move: RIGHT_MOVE,
		button_id: "right_key"
	}
}


const INITIAL_LIFES = 5
var current_lifes = INITIAL_LIFES
var TOTAL_FOOD_AMOUNT = 50
var BALL_5_COLOR = "#0000ff"
var BALL_15_COLOR = "#ff0000"
var BALL_25_COLOR = "#00b33c"
var TOTAL_TIME = 120
// todo: 2
var MONSTERS_AMOUNT = 1
// signIN/UP forms
//users storage 
var users_list = {};
users_list[k] = k;

$(document).ready(function () {

	// context=canvas.getContext("2d");
	//LOGIN
	$("#signInForm").validate({
		rules: {
			login_uname: {
				required: true,
			},
			login_psw: {
				required: true,
				validateUser: true
			}
		},
		messages: {
			login_uname: {
				required: "Enter your username."
			},
			login_psw: {
				required: "Enter your password",
				validateUser: "Username or Password is not exist."
			}
		},

		submitHandler: function () {

			login();

			//reset form details
			// let form = $("#sign_in_form");
			// form[0].reset();
		},
	});

	//SIGN UP
	$("#sign_up_form").validate({
		rules: {
			singup_username: {
				required: true,
				validateUniqUname: true
			},
			signup_psw: {
				required: true,
				strongPassword: true
			},
			singup_name: {
				required: true,
				lettersonly: true
			},
			signup_email: {
				required: true,
				email: true
			},
			// signup_bday: {
			// 	required: true
			// }
		},
		messages: {
			singup_username: {
				required: "Enter different username",
				validateUniqUname: "Username already exist."
			},
			signup_psw: {
				required: "Enter password",
				strongPassword: "Password must contain 6 charcters. at least one number and one letter"
			},
			singup_name: {
				required: "Enter your full name",
				lettersonly: "Full name only contain letters."
			},
			signup_email: {
				required: "Enter your e-mail",
				email: "Please enter a valid e-mail address."
			},
			// signup_bday: {
			// 	required: "Enter a birth day."
			// }
		},
		submitHandler: function () {

			register();

			//reset form details
			let form = $("#sign_up_form");
			form[0].reset();
		},
	});

});

$(function () {

	//SIGN UP

	//Password must contain 6 charcters. at least one number and one letter
	$.validator.addMethod('strongPassword', function (value, element) {
		return this.optional(element) ||
			value.length >= 6 &&
			/\d/.test(value) &&
			/[a-z]/i.test(value);
	});


	//check if username already exists
	$.validator.addMethod('validateUniqUname', function (value, element) {
		return !(value in users_list);
	});

	//Login

	//check if password match user
	$.validator.addMethod('validateUser', function (password, element) {

		let username_input = document.getElementById("login_uname_id").value;

		if (!(username_input in users_list)) {
			return false;
		}
		else if (users_list[username_input] == password) {
			return true;
		}

		return false;
	});

	//check if password match user
	$.validator.addMethod('greaterOrEqual', function (value, element, param) {
		return value >= param;
	});

	$.validator.addMethod("notEqualTo", function (value, element, param) {
		return value != $(param).val();
	});
});


// const isUserExists = (users, key) => {

//     return (key in users_list);
// };

const register = () => {

	//get elements
	let username = document.getElementById("singup_username_id").value;
	let pass = document.getElementById("signup_psw_id").value;

	//insert to storage
	users_list[username] = pass;

	//go to SIGN IN
	showSignin();
};

const login = () => {

	//go to settings
	showSettings();
};

function showAbout() {
	var T = document.getElementById("about");
	T.style.display = "block";

	document.getElementById("welcome").style.display = "none";
	document.getElementById("signup").style.display = "none";
	document.getElementById("signin").style.display = "none";
	document.getElementById("play").style.display = "none";
	document.getElementById("settings").style.display = "none";
};

function showWelcome() {
	var T = document.getElementById("welcome");
	T.style.display = "block";

	document.getElementById("about").style.display = "none";
	document.getElementById("signup").style.display = "none";
	document.getElementById("signin").style.display = "none";
	document.getElementById("play").style.display = "none";
	document.getElementById("settings").style.display = "none";
};

function showSignup() {
	var T = document.getElementById("signup");
	T.style.display = "block";

	document.getElementById("welcome").style.display = "none";
	document.getElementById("about").style.display = "none";
	document.getElementById("signin").style.display = "none";
	document.getElementById("play").style.display = "none";
	document.getElementById("settings").style.display = "none";
};
function showSignin() {
	var T = document.getElementById("signin");
	T.style.display = "block";

	document.getElementById("welcome").style.display = "none";
	document.getElementById("about").style.display = "none";
	document.getElementById("signup").style.display = "none";
	document.getElementById("play").style.display = "none";
	document.getElementById("settings").style.display = "none";
};
function showSettings() {
	var T = document.getElementById("settings");
	T.style.display = "block";
	var N = document.getElementById("secondNavbar");
	T.style.display = "block";

	document.getElementById("welcome").style.display = "none";
	document.getElementById("about").style.display = "none";
	document.getElementById("signup").style.display = "none";
	document.getElementById("play").style.display = "none";
	document.getElementById("signin").style.display = "none";
	document.getElementById("mainNavbar").style.display = "none";

};
function showPlay() {
	var T = document.getElementById("play");
	T.style.display = "block";

	document.getElementById("welcome").style.display = "none";
	document.getElementById("about").style.display = "none";
	document.getElementById("signup").style.display = "none";
	document.getElementById("signin").style.display = "none";
	document.getElementById("settings").style.display = "none";
};




// game





$(document).ready(function () {
	context = canvas.getContext("2d");
	timer = document.getElementById('timer');
	pill = document.getElementById('pill');
	strawberry = document.getElementById('strawberry');
	slow_motion = document.getElementById('slow_motion')

	// Relvant for fireworks:
	// now we will setup our basic variables for the demo
	// canvas2 = document.getElementById('canvas2');
	ctx = context
	// full screen dimensions
	cw = window.innerWidth
	ch = window.innerHeight
	// firework collection
	fireworks = []
	// particle collection
	particles = []
	// starting hue
	hue = 120
	// when launching fireworks with a click, too many get launched at once without a limiter, one launch per 5 loop ticks
	limiterTotal = 2
	limiterTick = 0
	// this will time the auto launches of fireworks, one launch per 10 loop ticks
	timerTotal = 10
	timerTick = 0
	mousedown = false

	$("#startGameBtn").click(function () {
		audio.play()
		Start();
	});

	$("#settingsRandomValuesBtn").click(function () {
		numOfBalls.value = getRandomInt(MIN_BALLS_AMOUNT, MAX_BALLS_AMOUNT)
		ball5color.value = getRandomColor()
		ball15color.value = getRandomColor()
		ball25color.value = getRandomColor()
		totalTime.value = getRandomInt(MIN_TIME_SECONDS, MIN_TIME_SECONDS * 10)
		monstersAmount.value = getRandomInt(MIN_MONSTERS_AMOUNT, MAX_MONSTERS_AMOUNT)

		TEMP_KEYS_DATA.down.keyCode = DEFAULT_DOWN_KEY
		TEMP_KEYS_DATA.up.keyCode = DEFAULT_UP_KEY
		TEMP_KEYS_DATA.left.keyCode = DEFAULT_LEFT_KEY
		TEMP_KEYS_DATA.right.keyCode = DEFAULT_RIGHT_KEY

		document.getElementById(TEMP_KEYS_DATA.down.button_id).value = "ArrowDown"
		document.getElementById(TEMP_KEYS_DATA.up.button_id).value = "ArrowUp"
		document.getElementById(TEMP_KEYS_DATA.left.button_id).value = "ArrowLeft"
		document.getElementById(TEMP_KEYS_DATA.right.button_id).value = "ArrowRight"
	});

	$("#down_key").click(function () {
		reset_key_downs()
		TEMP_KEYS_DATA.down.is_waiting_for_key = true
	});

	$("#up_key").click(function () {
		reset_key_downs()
		TEMP_KEYS_DATA.up.is_waiting_for_key = true
	});

	$("#right_key").click(function () {
		reset_key_downs()
		TEMP_KEYS_DATA.right.is_waiting_for_key = true
	});

	$("#left_key").click(function () {
		reset_key_downs()
		TEMP_KEYS_DATA.left.is_waiting_for_key = true
	});

	$("#settings_form").submit(function (event) {
		// TODO:
		TOTAL_FOOD_AMOUNT = ~~numOfBalls.value
		BALL_5_COLOR = ball5color.value
		BALL_15_COLOR = ball15color.value
		BALL_25_COLOR = ball25color.value
		TOTAL_TIME = ~~totalTime.value

		// todo:
		// MONSTERS_AMOUNT = 0
		MONSTERS_AMOUNT = ~~monstersAmount.value

		KEYS_DATA = JSON.parse(JSON.stringify(TEMP_KEYS_DATA))

		alert("Let's play!")
		event.preventDefault();
	});
});


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
	stopFireworks()
	board = new Array();
	score = 0;
	pac_color = "yellow";
	start_time = new Date();
	amount_of_balls_remain = TOTAL_FOOD_AMOUNT
	current_lifes = INITIAL_LIFES

	food_5_points_remain = ~~(TOTAL_FOOD_AMOUNT * 0.6)
	food_15_points_remain = ~~(TOTAL_FOOD_AMOUNT * 0.3)
	food_25_points_remain = TOTAL_FOOD_AMOUNT - food_5_points_remain - food_15_points_remain

	init_board();

	keyDown = -1;
	addEventListener(
		"keydown",
		function (e) {
			for (let k in KEYS_DATA) {

				// Change keyDown only if valid movement
				if (KEYS_DATA[k].keyCode == e.keyCode) {
					keyDown = e.keyCode
				}
			}


		},
		false
	);

	showGameSettings()

	// TODO: 250
	interval = setInterval(UpdatePosition, 250);
}

function showGameSettings() {
	down_key_show.value = down_key.value
	right_key_show.value = right_key.value
	up_key_show.value = up_key.value
	left_key_show.value = left_key.value

	numOfBalls_show.value = numOfBalls.value
	ball5color_show.value = ball5color.value
	ball15color_show.value = ball15color.value
	ball25color_show.value = ball25color.value
	totalTime_show.value = totalTime.value
	monstersAmount_show.value = monstersAmount.value
}

function init_board(food_remain, cnt, pacman_remain) {

	var cnt = ROWS * COLUMNS;

	var food_remain = TOTAL_FOOD_AMOUNT;

	// Init empty board
	for (var i = 0; i < ROWS; i++) {
		board[i] = new Array();
	}

	init_walls();

	// init monsters
	init_monsters();

	for (var i = 0; i < ROWS; i++) {
		//put obstacles in (i=3,j=3) and (i=3,j=4) and (i=3,j=5), (i=6,j=1) and (i=6,j=2)
		for (var j = 0; j < COLUMNS; j++) {
			if (!board[i][j]) {
				var randomNum = Math.random();
				// Where to put food
				if (randomNum <= (1.0 * food_remain) / cnt) {
					food_remain--;

					// Random which food type based on amount of each type remain
					food_type_index = ~~(Math.random() * (food_5_points_remain + food_15_points_remain + food_25_points_remain));
					if (food_type_index < food_5_points_remain) {
						board[i][j] = cellType.FOOD_5_POINTS;
						food_5_points_remain--;
					} else if (food_type_index < food_5_points_remain + food_15_points_remain) {
						board[i][j] = cellType.FOOD_15_POINTS;
						food_15_points_remain--;
					} else {
						board[i][j] = cellType.FOOD_25_POINTS;
						food_25_points_remain--;
					}
					// There to put pacman
				} else {
					board[i][j] = cellType.EMPTY;
				}
				cnt--;
			}
		}
	}

	// Put food remains
	while (food_remain > 0) {
		var emptyCell = findRandomEmptyCell(board);
		if (food_5_points_remain > 0) {
			board[emptyCell[0]][emptyCell[1]] = cellType.FOOD_5_POINTS;
			food_5_points_remain--;
		} else if (food_15_points_remain > 0) {
			board[emptyCell[0]][emptyCell[1]] = cellType.FOOD_15_POINTS;
			food_15_points_remain--;
		} else {
			board[emptyCell[0]][emptyCell[1]] = cellType.FOOD_25_POINTS;
			food_25_points_remain--;
		}
		food_remain--;
	}

	// Put pacman
	init_pacman();

	// Put timer bonus
	emptyCell = findRandomEmptyCell(board);
	board[emptyCell[0]][emptyCell[1]] = cellType.TIME_BUNOS;

	// Put pill bunos
	emptyCell = findRandomEmptyCell(board);
	board[emptyCell[0]][emptyCell[1]] = cellType.PILL;

	// Put slow motion pill
	emptyCell = findRandomEmptyCell(board);
	board[emptyCell[0]][emptyCell[1]] = cellType.SLOW_MOTION;

	// Put strawberry
	emptyCell = findRandomEmptyCell(board);
	board[emptyCell[0]][emptyCell[1]] = cellType.STRAWBERRY;

	strawberry_position.i = emptyCell[0];
	strawberry_position.j = emptyCell[1];
	strawberry_position.prev_value = cellType.EMPTY;
	strawberry_position.is_alive = true;
}

function init_walls() {

	for (var i = 0; i < ROWS; i++) {
		board[i][0] = cellType.WALL;
		board[i][COLUMNS -1] = cellType.WALL;
	}

	for (var i = 0; i < COLUMNS; i++) {
		board[0][i] = cellType.WALL;
		board[ROWS - 1][i] = cellType.WALL;
	}

	board[2][2] = cellType.WALL;
	board[3][2] = cellType.WALL;
	board[4][2] = cellType.WALL;

	board[7][0] = cellType.WALL;
	board[7][1] = cellType.WALL;
	board[7][2] = cellType.WALL;
	board[7][3] = cellType.WALL;

	board[4][5] = cellType.WALL;
	board[4][6] = cellType.WALL;
	board[4][7] = cellType.WALL;
	board[5][7] = cellType.WALL;
	board[6][7] = cellType.WALL;
	board[7][7] = cellType.WALL;

	board[2][12] = cellType.WALL;
	board[3][12] = cellType.WALL;
	board[4][12] = cellType.WALL;
	board[4][11] = cellType.WALL;
	board[4][10] = cellType.WALL;

	board[7][11] = cellType.WALL;
	board[7][12] = cellType.WALL;
	board[7][13] = cellType.WALL;
	board[7][14] = cellType.WALL;

	board[10][2] = cellType.WALL;
	board[11][2] = cellType.WALL;
	board[11][3] = cellType.WALL;
	board[11][4] = cellType.WALL;
	board[11][5] = cellType.WALL;

	board[9][9] = cellType.WALL;
	board[10][9] = cellType.WALL;
	board[11][9] = cellType.WALL;
	board[12][9] = cellType.WALL;
	board[12][9] = cellType.WALL;
	board[12][10] = cellType.WALL;
	board[12][11] = cellType.WALL;

	board[9][13] = cellType.WALL;

	board[7][13] = cellType.WALL;
	board[7][14] = cellType.WALL;

	board[13][3] = cellType.WALL;

}

function init_pacman(emptyCell) {
	emptyCell = findRandomEmptyCell(board);
	board[emptyCell[0]][emptyCell[1]] = cellType.PACMAN;
	pacman_position.i = emptyCell[0]
	pacman_position.j = emptyCell[1]
}

function init_monsters() {

	monsters.forEach(monster => monster.is_alive = false)

	for (i = 0; i < MONSTERS_AMOUNT; i++) {
		curr_monster = monsters[i]
		if (curr_monster.position.prev_value) {
			board[curr_monster.position.i][curr_monster.position.j] = curr_monster.position.prev_value;
		}

		board[curr_monster.initial_i][curr_monster.initial_i] = curr_monster.cellType;
		curr_monster.position.i = curr_monster.initial_i;
		curr_monster.position.j = curr_monster.initial_j;
		curr_monster.position.prev_value = cellType.EMPTY;
		curr_monster.is_alive = true;
	}
}

function findRandomEmptyCell(board) {
	var i = Math.floor(Math.random() * ROWS);
	var j = Math.floor(Math.random() * COLUMNS);
	while (board[i][j] != cellType.EMPTY) {
		i = Math.floor(Math.random() * ROWS);
		j = Math.floor(Math.random() * COLUMNS);
	}
	return [i, j];
}

function GetKeyPressed() {
	for (const [key, value] of Object.entries(KEYS_DATA)) {
		if (keyDown == value.keyCode) {
			return value.move
		}
	}
}

function reset_key_downs() {
	for (const [key, value] of Object.entries(TEMP_KEYS_DATA)) {
		value.is_waiting_for_key = false
	}
}

document.addEventListener("keydown", event => {

	current_key_codes = Object.entries(TEMP_KEYS_DATA).map(x => x[1].keyCode)

	for (const [key, value] of Object.entries(TEMP_KEYS_DATA)) {
		if (value.is_waiting_for_key && !current_key_codes.includes(event.keyCode)) {
			value.keyCode = event.keyCode
			document.getElementById(value.button_id).value = event.key
		}

		value.is_waiting_for_key = false
	}
});



function Draw(pacman_direction = RIGHT_MOVE) {
	canvas.width = canvas.width; //clean board

	cell_width = canvas.width / COLUMNS
	cell_height = canvas.height / ROWS
	CELL_SIZE = cell_width

	lblScore.value = score;
	lblLifes.value = current_lifes;
	lblTime.value = time_remain;
	for (var i = 0; i < COLUMNS; i++) {
		for (var j = 0; j < ROWS; j++) {
			var center = new Object();
			center.x = i * CELL_SIZE + CELL_SIZE / 2;
			center.y = j * CELL_SIZE + CELL_SIZE / 2;
			if (board[i][j] == cellType.PACMAN) {
				const { mouth_angle, eye_position } = get_pacman_view_props(pacman_direction, center);
				context.beginPath();
				context.arc(center.x, center.y, CELL_SIZE / 2, (mouth_angle + 0.15) * Math.PI, (mouth_angle + 1.85) * Math.PI); // half circle
				context.lineTo(center.x, center.y);
				context.fillStyle = pac_color; //color
				context.fill();
				context.beginPath();
				context.arc(eye_position.x, eye_position.y, 3, 0, 2 * Math.PI); // circle
				context.fillStyle = "black"; //color
				context.fill();
			} else if (board[i][j] == cellType.FOOD_5_POINTS) {
				context.beginPath();
				context.arc(center.x, center.y, CELL_SIZE / 4, 0, 2 * Math.PI); // circle
				context.fillStyle = BALL_5_COLOR; //color
				context.fill();

				context.fillStyle = "white";
				context.font = "14px Arial";
				context.fillText("5", center.x - 5, center.y + 5);
			}
			else if (board[i][j] == cellType.FOOD_15_POINTS) {
				context.beginPath();
				context.arc(center.x, center.y, CELL_SIZE / 3.5, 0, 2 * Math.PI); // circle
				context.fillStyle = BALL_15_COLOR; //color
				context.fill();
				context.fillStyle = "white";
				context.font = "14px Arial";
				context.fillText("15", center.x - 8, center.y + 5);
			}
			else if (board[i][j] == cellType.FOOD_25_POINTS) {
				context.beginPath();
				context.arc(center.x, center.y, CELL_SIZE / 3, 0, 2 * Math.PI); // circle
				context.fillStyle = BALL_25_COLOR; //color
				context.fill();
				context.fillStyle = "white";
				context.font = "14px Arial";
				context.fillText("25", center.x - 8, center.y + 5);
			} else if (board[i][j] == cellType.WALL) {
				context.beginPath();
				context.rect(center.x - CELL_SIZE / 2, center.y - CELL_SIZE / 2, CELL_SIZE, CELL_SIZE);
				context.fillStyle = "grey"; //color
				context.fill();
			}
			else if (board[i][j] == cellType.TIME_BUNOS) {
				context.drawImage(timer, center.x - 10, center.y - 12, 23, 23);
			}
			else if (board[i][j] == cellType.PILL) {
				context.drawImage(pill, center.x - 10, center.y - 12, 23, 23);
			}
			else if (board[i][j] == cellType.STRAWBERRY && strawberry_position.is_alive) {
				context.drawImage(strawberry, center.x - 10, center.y - 12, 23, 23);
			}
			else if (board[i][j] == cellType.SLOW_MOTION) {
				context.drawImage(slow_motion, center.x - 10, center.y - 12, 23, 23);
			}

			monsters.forEach(monster => {
				if (board[i][j] == monster.cellType && monster.is_alive) {
					context.drawImage(monster1, center.x - 10, center.y - 12, 23, 23);
				}
			})
		}
	}
}

function get_pacman_view_props(move, center) {
	angle = 0;
	if (move == RIGHT_MOVE) {
		mouth_angle = 0;
		eye_position = {
			x: center.x + 5,
			y: center.y - 15
		};
	} else if (move == DOWN_MOVE) {
		mouth_angle = 0.5;
		eye_position = {
			x: center.x + 15,
			y: center.y - 5
		};
	}
	else if (move == UP_MOVE) {
		mouth_angle = -0.5;
		eye_position = {
			x: center.x + 15,
			y: center.y + 5
		};
	}
	else if (move == LEFT_MOVE) {
		mouth_angle = 1;
		eye_position = {
			x: center.x + 5,
			y: center.y - 15
		};
	}

	return {
		mouth_angle,
		eye_position
	};
}

function same_positions(x, y) {
	if (x.i == y.i && x.j == y.j) {
		return true
	}
	return false
}

function UpdatePosition() {
	count_steps += 1;
	board[pacman_position.i][pacman_position.j] = cellType.EMPTY;
	curr_move = GetKeyPressed()

	movePosition(pacman_position, curr_move, true);

	if (!(same_positions(pacman_position, strawberry_position)) && strawberry_position.is_alive) {
		board[strawberry_position.i][strawberry_position.j] = strawberry_position.prev_value;
		movePosition(strawberry_position, getRandomInt(1, 4), false);
		strawberry_position.prev_value = board[strawberry_position.i][strawberry_position.j]
		board[strawberry_position.i][strawberry_position.j] = cellType.STRAWBERRY;
	}

	monsters.forEach(monster => {
		if (!is_slow_motion || count_steps % 3 == 0) {
			if (monster.is_alive) {
				board[monster.position.i][monster.position.j] = monster.position.prev_value;
				moveMonster(monster.position);
				monster.position.prev_value = board[monster.position.i][monster.position.j]
				board[monster.position.i][monster.position.j] = monster.cellType;
			}
		}
	})


	if (board[pacman_position.i][pacman_position.j] == cellType.FOOD_5_POINTS) {
		score += 5;
		amount_of_balls_remain--;
	} else if (board[pacman_position.i][pacman_position.j] == cellType.FOOD_15_POINTS) {
		score += 15;
		amount_of_balls_remain--;
	} else if (board[pacman_position.i][pacman_position.j] == cellType.FOOD_25_POINTS) {
		score += 25;
		amount_of_balls_remain--;
	} else if (board[pacman_position.i][pacman_position.j] == cellType.TIME_BUNOS) {
		TOTAL_TIME += TIME_BUNOS_SECONDS
	} else if (board[pacman_position.i][pacman_position.j] == cellType.PILL) {
		current_lifes += 1
	} else if (board[pacman_position.i][pacman_position.j] == cellType.SLOW_MOTION) {
		is_slow_motion = true
		setTimeout(() => {
			is_slow_motion = false
			emptyCell = findRandomEmptyCell(board);
			board[emptyCell[0]][emptyCell[1]] = cellType.SLOW_MOTION;

		}, SLOW_MOTION_TIMEOUT)
	} else if (board[pacman_position.i][pacman_position.j] == cellType.STRAWBERRY) {
		score += STRAWBERRY_POINTS_VALUE
		strawberry_position.is_alive = false

		if (FOOD_CELLS.includes(strawberry_position.prev_value)) {
			amount_of_balls_remain--;
		}
		// If pacman on monster
	} else if (MONSTER_CELLS.includes(board[pacman_position.i][pacman_position.j])) {
		current_lifes -= 1
		score -= MONSTER_EAT_PENALTY
		if (current_lifes > 0) {
			init_monsters()
			init_pacman()
		}
	}

	board[pacman_position.i][pacman_position.j] = cellType.PACMAN;
	var currentTime = new Date();
	time_elapsed = (currentTime - start_time) / 1000;
	time_remain = ~~(TOTAL_TIME - time_elapsed);
	if (amount_of_balls_remain == 0) {
		Draw(curr_move);
		window.clearInterval(interval);
		showFireworks()
		console.log("winner", interval)
		setTimeout(() => window.alert("Winner!!!"), 100);

	} else if (time_remain == 0) {
		Draw(curr_move);
		window.clearInterval(interval);
		showLost()
		setTimeout(() => window.alert("You are better than " + score + " Points!"), 100);

	}
	else if (current_lifes == 0) {
		Draw(curr_move);
		window.clearInterval(interval);
		showLost()
		setTimeout(() => window.alert("Loser!"), 100);

	}
	else {
		Draw(curr_move);
	}
}

function movePosition(position, direction, is_pacman_move) {

	maybe_new_place =
	{
		i: position.i,
		j: position.j
	}

	if (direction == UP_MOVE && position.j > 0) {
		maybe_new_place.j -= 1
	}
	else if (direction == DOWN_MOVE && position.j < ROWS - 1) {
		maybe_new_place.j += 1
	}
	else if (direction == LEFT_MOVE && position.i > 0) {
		maybe_new_place.i--;
	}
	else if (direction == RIGHT_MOVE && position.i < COLUMNS - 1) {
		maybe_new_place.i++;
	}

	new_place_cell_type = board[maybe_new_place.i][maybe_new_place.j]

	if (new_place_cell_type != cellType.WALL) {
		if (!NON_ACCESS_CELLS.includes(new_place_cell_type) || is_pacman_move) {
			position.i = maybe_new_place.i
			position.j = maybe_new_place.j
		}
	}
}

function moveMonster(monster_position) {

	if (monster_position.i > pacman_position.i && !NON_ACCESS_CELLS.includes(board[monster_position.i - 1][monster_position.j])) {
		monster_position.i -= 1
	} else if (monster_position.i < pacman_position.i && !NON_ACCESS_CELLS.includes(board[monster_position.i + 1][monster_position.j])) {
		monster_position.i += 1
	} else if (monster_position.j > pacman_position.j && !NON_ACCESS_CELLS.includes(board[monster_position.i][monster_position.j - 1])) {
		monster_position.j -= 1
	} else if (monster_position.j < pacman_position.j && !NON_ACCESS_CELLS.includes(board[monster_position.i][monster_position.j + 1])) {
		monster_position.j += 1
	}
}

function showLost() {
	context.drawImage(lost, 50, 50, 500, 500);
}














// --------------------------------------------------------------------- FIREWORKS ----------------------------------------------------
// when animating on canvas, it is best to use requestAnimationFrame instead of setTimeout or setInterval
// not supported in all browsers though and sometimes needs a prefix, so we need a shim
window.requestAnimFrame = (function () {
	return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		function (callback) {
			window.setTimeout(callback, 1000 / 60);
		};
})();


// now we are going to setup our function placeholders for the entire demo

// get a random number within a range
function random(min, max) {
	return Math.random() * (max - min) + min;
}

// calculate the distance between two points
function calculateDistance(p1x, p1y, p2x, p2y) {
	var xDistance = p1x - p2x,
		yDistance = p1y - p2y;
	return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}

// create firework
function Firework(sx, sy, tx, ty) {
	// actual coordinates
	this.x = sx;
	this.y = sy;
	// starting coordinates
	this.sx = sx;
	this.sy = sy;
	// target coordinates
	this.tx = tx;
	this.ty = ty;
	// distance from starting point to target
	this.distanceToTarget = calculateDistance(sx, sy, tx, ty);
	this.distanceTraveled = 0;
	// track the past coordinates of each firework to create a trail effect, increase the coordinate count to create more prominent trails
	this.coordinates = [];
	this.coordinateCount = 3;
	// populate initial coordinate collection with the current coordinates
	while (this.coordinateCount--) {
		this.coordinates.push([this.x, this.y]);
	}
	this.angle = Math.atan2(ty - sy, tx - sx);
	this.speed = 2;
	this.acceleration = 1.05;
	this.brightness = random(50, 70);
	// circle target indicator radius
	this.targetRadius = 1;
}

// update firework
Firework.prototype.update = function (index) {
	// remove last item in coordinates array
	this.coordinates.pop();
	// add current coordinates to the start of the array
	this.coordinates.unshift([this.x, this.y]);

	// cycle the circle target indicator radius
	if (this.targetRadius < 8) {
		this.targetRadius += 0.3;
	} else {
		this.targetRadius = 1;
	}

	// speed up the firework
	this.speed *= this.acceleration;

	// get the current velocities based on angle and speed
	var vx = Math.cos(this.angle) * this.speed,
		vy = Math.sin(this.angle) * this.speed;
	// how far will the firework have traveled with velocities applied?
	this.distanceTraveled = calculateDistance(this.sx, this.sy, this.x + vx, this.y + vy);

	// if the distance traveled, including velocities, is greater than the initial distance to the target, then the target has been reached
	if (this.distanceTraveled >= this.distanceToTarget) {
		createParticles(this.tx, this.ty);
		// remove the firework, use the index passed into the update function to determine which to remove
		fireworks.splice(index, 1);
	} else {
		// target not reached, keep traveling
		this.x += vx;
		this.y += vy;
	}
}

// draw firework
Firework.prototype.draw = function () {
	ctx.beginPath();
	// move to the last tracked coordinate in the set, then draw a line to the current x and y
	ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
	ctx.lineTo(this.x, this.y);
	ctx.strokeStyle = 'hsl(' + hue + ', 100%, ' + this.brightness + '%)';
	ctx.stroke();

	ctx.beginPath();
	// draw the target for this firework with a pulsing circle
	ctx.arc(this.tx, this.ty, this.targetRadius, 0, Math.PI * 2);
	ctx.stroke();
}

// create particle
function Particle(x, y) {
	this.x = x;
	this.y = y;
	// track the past coordinates of each particle to create a trail effect, increase the coordinate count to create more prominent trails
	this.coordinates = [];
	this.coordinateCount = 5;
	while (this.coordinateCount--) {
		this.coordinates.push([this.x, this.y]);
	}
	// set a random angle in all possible directions, in radians
	this.angle = random(0, Math.PI * 2);
	this.speed = random(1, 10);
	// friction will slow the particle down
	this.friction = 0.95;
	// gravity will be applied and pull the particle down
	this.gravity = 1;
	// set the hue to a random number +-50 of the overall hue variable
	this.hue = random(hue - 50, hue + 50);
	this.brightness = random(50, 80);
	this.alpha = 1;
	// set how fast the particle fades out
	this.decay = random(0.015, 0.03);
}

// update particle
Particle.prototype.update = function (index) {
	// remove last item in coordinates array
	this.coordinates.pop();
	// add current coordinates to the start of the array
	this.coordinates.unshift([this.x, this.y]);
	// slow down the particle
	this.speed *= this.friction;
	// apply velocity
	this.x += Math.cos(this.angle) * this.speed;
	this.y += Math.sin(this.angle) * this.speed + this.gravity;
	// fade out the particle
	this.alpha -= this.decay;

	// remove the particle once the alpha is low enough, based on the passed in index
	if (this.alpha <= this.decay) {
		particles.splice(index, 1);
	}
}

// draw particle
Particle.prototype.draw = function () {
	ctx.beginPath();
	// move to the last tracked coordinates in the set, then draw a line to the current x and y
	ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
	ctx.lineTo(this.x, this.y);
	ctx.strokeStyle = 'hsla(' + this.hue + ', 100%, ' + this.brightness + '%, ' + this.alpha + ')';
	ctx.stroke();
}

// create particle group/explosion
function createParticles(x, y) {
	// increase the particle count for a bigger explosion, beware of the canvas performance hit with the increased particles though
	var particleCount = 30;
	while (particleCount--) {
		particles.push(new Particle(x, y));
	}
}


function stopFireworks() {
	isShowingFireworks = false
}

function showFireworks() {
	isShowingFireworks = true
	displayFireworks()
}
// main demo loop
function displayFireworks() {
	if (!isShowingFireworks) {
		return
	}
	// this function will run endlessly with requestAnimationFrame
	requestAnimFrame(displayFireworks);

	// increase the hue to get different colored fireworks over time
	//hue += 0.5;

	// create random color
	hue = random(0, 360);

	// normally, clearRect() would be used to clear the canvas
	// we want to create a trailing effect though
	// setting the composite operation to destination-out will allow us to clear the canvas at a specific opacity, rather than wiping it entirely
	ctx.globalCompositeOperation = 'destination-out';
	// decrease the alpha property to create more prominent trails
	ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
	ctx.fillRect(0, 0, cw, ch);
	// change the composite operation back to our main mode
	// lighter creates bright highlight points as the fireworks and particles overlap each other
	ctx.globalCompositeOperation = 'lighter';

	// loop over each firework, draw it, update it
	var i = fireworks.length;
	while (i--) {
		fireworks[i].draw();
		fireworks[i].update(i);
	}

	// loop over each particle, draw it, update it
	var i = particles.length;
	while (i--) {
		particles[i].draw();
		particles[i].update(i);
	}

	// launch fireworks automatically to random coordinates, when the mouse isn't down
	if (timerTick >= timerTotal) {
		if (!mousedown) {
			// start the firework at the bottom middle of the screen, then set the random target coordinates, the random y coordinates will be set within the range of the top half of the screen
			fireworks.push(new Firework(cw / 2, ch, random(0, cw), random(0, ch / 2)));
			timerTick = 0;
		}
	} else {
		timerTick++;
	}

	// limit the rate at which fireworks get launched when mouse is down
	if (limiterTick >= limiterTotal) {
		if (mousedown) {
			// start the firework at the bottom middle of the screen, then set the current mouse coordinates as the target
			fireworks.push(new Firework(cw / 2, ch, mx, my));
			limiterTick = 0;
		}
	} else {
		limiterTick++;
	}
}

