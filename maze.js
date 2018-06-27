class Maze {
	constructor(o) {
		let s = Object.assign({
			cols: DEFAULT_COLS,
			rows: DEFAULT_ROWS,
			cellSize: DEFAULT_CELL_SIZE,
			wallSize: DEFAULT_WALL_SIZE,
			cellColor: 33,
			wallColor: 250,
			animate: true
		}, o);
		
		this.g = new Graph();
		this.cols = s.cols;
		this.rows = s.rows;
		
		this.cellSize = s.cellSize;
		this.wallSize = s.wallSize;
		
		this.cellColor = s.cellColor;
		this.wallColor = s.wallColor;
		
		this.width = this.getWidth();
		this.height = this.getHeight();
		
		this.graphics = createGraphics(this.width, this.height);
		this.graphics.noCanvas();
		this.graphics.pixelDensity(1);
		
		this.drawPath = [];
		this.animate = s.animate;
		
		this.timeStart = 0;
		this.timeEnd = 0;
		
		this.current = 0;
		this.stack = [];
		
		this.doneCallback = s.doneCallback;
		this.animationDoneCallback = s.animationDoneCallback;
		
		this._generateStructure();
		this.drawBackground();
	}
	
	_generateStructure() {
		// Filling graph with nodes (grid pattern)
		let l = this.cols * this.rows;
		for (let i = 0; i < l; i++) {
			this.g.addNode({visited: false, disabled: false});
		}
		
		// Neighbors
		for (let i = 0; i < l; i++) {
			if ((i + 1) % this.cols != 0)
				this.g.addLine(i, i + 1);
			if (i % this.cols != 0)
				this.g.addLine(i, i - 1);
			
			this.g.addLine(i, i + this.cols);
			this.g.addLine(i, i - this.cols);
		}
	}
	
	removeCells(p1, p2) {
		let l = this.g.nodes.length - 1;
		for (let i = l; i >= 0; i--) {
			let cellPos = this.getCellXY(i);
			
			if (pointInRect(cellPos.x, cellPos.y, p1, p2) && !this.g.nodes[i].disabled) {
				this.g.nodes[i].visited = true;
				this.g.nodes[i].disabled = true;
			}
		}
	}
	
	getWidth() {
		return this.cellSize * this.cols + this.wallSize * this.cols + this.wallSize;
	}
	
	
	getHeight() {
		return this.cellSize * this.rows + this.wallSize * this.rows + this.wallSize;
	}
	
	getCellXY(index) {
		let x = index % this.cols;
		let y = Math.trunc(index / this.cols);
		
		x = x * this.cellSize + (x + 1) * this.wallSize + this.cellSize / 2;
		y = y * this.cellSize + (y + 1) * this.wallSize + this.cellSize / 2;
		
		return {x: x, y: y};
	}
	
	unvisited(arrayOfCells) {
		let l = arrayOfCells.length;
		for (let i = 0; i < l; i++) {
			if (arrayOfCells[i].visited == false)
				return true;
		}
		
		return false;
	}
	
	unvisitedNeighbors(index) {
		let i = this.g.getNeighbors(index);
		let n = [];
		
		for (let j of i)
			n.push(this.g.nodes[j]);
		
		return this.unvisited(n);
	}
	
	getUnvisitedNeighbors(i) {
		//console.log('Getting unvisited neighbors of', i);
		let n = this.g.getNeighbors(i);
		let uN = [];
		
		for (let j = 0; j < n.length; j++) {
			if (this.g.nodes[n[j]].visited == false && this.g.nodes[n[j]].disabled == false)
			 	uN.push(n[j]);
		}
		
		return uN;
	}
	
	removeWall(i, j) {
		//console.log('Removing wall between', i, j);
		this.g.deleteLine(i, j);
	}
	
	markVisited(i) {
		//console.log('Marking visited', i);
		this.g.nodes[i].visited = true;
	}
	
	generate() {
		this.timeStart = performance.now();
		
		if (this.current != undefined) {
			let pool = [];
			
			let l = this.g.nodes.length;
			for (let i = 0; i < l; i++) {
				if (!this.g.nodes[i].disabled) {
					pool.push(i);
				}
			}
			
			if (!pool.length) return;
			
			this.current = pool[floor(random(0, pool.length - 1))];
			this.markVisited(this.current);
			
			while (this.unvisited(this.g.nodes)) {
				// console.log('There are unvisited cells');
				if (this.unvisitedNeighbors(this.current)) {
					// console.log('Current cell have unvisited neighbors');
					let uN = this.getUnvisitedNeighbors(this.current);
					let chosen = uN[Math.round(random(0, uN.length -1))];
					
					this.stack.push(this.current);
					this.removeWall(this.current, chosen);
					
					this.drawPath.push([this.current, chosen]);
					
					this.current = chosen;
					this.markVisited(this.current);
				} else if (this.stack.length != 0) {
					// console.log('Stack is not empty');
					this.current = this.stack.pop();
				} else {
					console.log('Broken Maze!');
					return;
				}
			}
			
			this.done();
		}
	}
	
	done() {
		this.current = undefined;
		
		let time = (performance.now() - this.timeStart) / 1000;
		time = Math.round(time * 100) / 100;
		
		console.clear();
		console.log('Generated in ', time, ' seconds!');
		
		if (this.doneCallback) this.doneCallback();
	}
	
	drawBackground() {
		this.graphics.background(this.wallColor);
	}
	
	draw() {
		while (this.drawPath.length) {
			let current = this.drawPath[0];
			this.drawPath.splice(0, 1);
			
			let currentX = current[0] % this.cols;
			let currentY = Math.trunc(current[0] / this.cols);
			
			let chosenX = current[1] % this.cols;
			let chosenY = Math.trunc(current[1] / this.cols);
			
			let X1 = currentX * this.cellSize + (currentX + 1) * this.wallSize + this.cellSize / 2;
			let Y1 = currentY * this.cellSize + (currentY + 1) * this.wallSize + this.cellSize / 2;
			
			let X2 = chosenX * this.cellSize + (chosenX + 1) * this.wallSize + this.cellSize / 2;
			let Y2 = chosenY * this.cellSize + (chosenY + 1) * this.wallSize + this.cellSize / 2;
			
			this.graphics.noSmooth();
			this.graphics.strokeCap(PROJECT);
			this.graphics.strokeWeight(this.cellSize);
			this.graphics.stroke(this.cellColor);
			this.graphics.line(Math.floor(X1), Math.floor(Y1), Math.floor(X2), Math.floor(Y2));
			
			if (this.animate) break;
		}
		
		if (this.drawPath.length == 0 && this.current == undefined) {
			if (this.animationDoneCallback) this.animationDoneCallback();
			noLoop();
		}
		
		return this.graphics;
	}
	
	drawCells() {
		this.drawBackground();
		
		let l = this.g.nodes.length;
		for (let i = 0; i < l; i++) {
			if (this.g.nodes[i].disabled) continue;
			
			let cell = this.getCellXY(i);
			
			this.graphics.noStroke();
			this.graphics.fill(this.cellColor);
			this.graphics.rectMode(CENTER);
			this.graphics.rect(cell.x, cell.y, this.cellSize, this.cellSize);
		}
		
		return this.graphics;
	}
}
