const DEFAULT_COLS = 20;
const DEFAULT_ROWS = 20;
const DEFAULT_CELL_SIZE = 12;
const DEFAULT_WALL_SIZE = 6;

const MAX_COLS = 1000;
const MAX_ROWS = 1000;
const MAX_CELL_SIZE = 512;
const MAX_WALL_SIZE = 512;

let colsInput = document.getElementById('cols');
let rowsInput = document.getElementById('rows');
let cellInput = document.getElementById('cell');
let wallInput = document.getElementById('wall');
let cellColorInput = document.getElementById('cellColor');
let wallColorInput = document.getElementById('wallColor');
let animateInput = document.getElementById('animate');
let newInput = document.getElementById('new');
let customInput = document.getElementById('custom');
let generateInput = document.getElementById('generate');
let saveInput = document.getElementById('save');

let canvas;
let maze;
let custom = false;
let mouseFirst;
let mouseSecond;

animateInput.addEventListener('click', stopAnimation);
newInput.addEventListener('click', newMaze);
customInput.addEventListener('click', createCustom);
generateInput.addEventListener('click', generateMaze);
saveInput.addEventListener('click', saveMaze);

function setup() {
	canvas = createCanvas();
	canvas.parent('maze');
	
	pixelDensity(1);
	
	newMaze();
}

function draw() {
	if (!custom)
		image(maze.draw(), 0, 0);
	else {
		image(maze.drawCells(), 0, 0);
		
		stroke(33, 33, 127);
		
		let halfWidth = floor(maze.width / 2);
		let halfHeight = floor(maze.height / 2);
		
		line(halfWidth, 0, halfWidth, maze.height);
		line(0, halfHeight, maze.width, halfHeight);
		
		if (mouseFirst && mouseSecond) {
			noStroke();
			fill(127, 33, 33, 196);
			rectMode(CORNERS);
			rect(mouseFirst.x, mouseFirst.y, mouseSecond.x, mouseSecond.y);
		}
	}
}

function mouseDragged() {
	mouseSecond = {};
	mouseSecond.x = mouseX;
	mouseSecond.y = mouseY;
}

function mousePressed() {
	mouseFirst = {};
	mouseFirst.x = mouseX;
	mouseFirst.y = mouseY;
}

function mouseReleased() {
	mouseDragged();
	
	if (custom)
		maze.removeCells(mouseFirst, mouseSecond);
	
	mouseFirst = undefined;
	mouseSecond = undefined;
}

function stopAnimation() {
	if (!animateInput.checked)
		maze.animate = false;
}

function createMaze() {
	let cols = colsInput.value ? int(colsInput.value) : DEFAULT_COLS;
	let rows = rowsInput.value ? int(rowsInput.value) : DEFAULT_ROWS;
	let cell = cellInput.value ? int(cellInput.value) : DEFAULT_CELL_SIZE;
	let wall = wallInput.value ? int(wallInput.value) : DEFAULT_WALL_SIZE;
	let cellColor = cellColorInput.value;
	let wallColor = wallColorInput.value;
	let animate = boolean(animateInput.checked);
	
	maze = new Maze({
		cols: max(min(cols, MAX_COLS), 1),
		rows: max(min(rows, MAX_ROWS), 1),
		cellSize: max(min(cell, MAX_CELL_SIZE), 1),
		wallSize: max(min(wall, MAX_WALL_SIZE), 1),
		cellColor: cellColor,
		wallColor: wallColor,
		animate: animate,
		animationDoneCallback: done
	});
	
	resizeCanvas(maze.width, maze.height);
}

function newMaze() {
	canvas.canvas.classList.remove('done');
	custom = false;
	createMaze();
	generateMaze();
	loop();
}

function createCustom() {
	canvas.canvas.classList.remove('done');
	custom = true;
	customInput.style.display = 'none';
	generateInput.style.display = '';
	
	createMaze();
	loop();
}

function generateMaze() {
	custom = false;
	customInput.style.display = '';
	generateInput.style.display = 'none';
	
	maze.generate();
	maze.drawBackground();
}

function done() {
	canvas.canvas.classList.add('done');
}

function saveMaze() {
	noLoop();
	saveCanvas('maze.png');
}

function pointInRect(x, y, p1, p2) {
	return 	inRange(x, p1.x, p2.x) &&
					inRange(y, p1.y, p2.y);
};

function inRange(value, min, max) {
	return value >= Math.min(min, max) && value <= Math.max(min, max);
};
