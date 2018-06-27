class Graph {
	constructor() {
		this.nodes = [];
		this.lines = [];
	}
	
	addNode(node) {
		this.nodes.push(node);
	}
	
	deleteNode(index) {
		console.log('co jest kurwa');
		this.nodes.splice(index, 1);
		this.deleteLinesWith(index);
	}
	
	hasLine(firstIndex, secondIndex) {
		let l = this.lines.length;
		for (let i = 0; i < l; i++) {
			if (this.lines[i][0] == firstIndex && this.lines[i][1] == secondIndex)
				return true;
			
			if (this.lines[i][1] == firstIndex && this.lines[i][0] == secondIndex)
				return true;
		}
		
		return false;
	}
	
	addLine(firstIndex, secondIndex) {
		if (firstIndex < 0 || firstIndex >= this.nodes.length)
			return;
		
		if (secondIndex < 0 || secondIndex >= this.nodes.length)
			return;
		
		if (this.hasLine(firstIndex, secondIndex))
			return;
		
		this.lines.push([firstIndex, secondIndex]);
	}
	
	deleteLine(firstIndex, secondIndex) {
		let l = this.lines.length - 1;
		for (let i = l; i >= 0; i--) {
			if (this.lines[i][0] == firstIndex && this.lines[i][1] == secondIndex)
				this.lines.splice(i, 1);
			else if (this.lines[i][1] == firstIndex && this.lines[i][0] == secondIndex)
				this.lines.splice(i, 1);
		}
	}
	
	deleteLinesWith(index) {
		let l = this.lines.length - 1;
		for (let i = l; i >= 0; i--) {
			if (this.lines[i][0] == index || this.lines[i][1] == index)
				this.lines.splice(i, 1);
		}
	}
	
	getNeighbors(index) {
		let n = [];
		
		let l = this.lines.length;
		for (let i = 0; i < l; i++) {
			if (this.lines[i][0] == index)
				n.push(this.lines[i][1]);
			
			if (this.lines[i][1] == index)
				n.push(this.lines[i][0]);
		}
		
		return n;
	}
}
