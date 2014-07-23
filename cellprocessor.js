function CellProcessor() {
	this.codeRunner = new CodeRunner();

	// load helper functions
	this.codeRunner.addFunction("create2DArray",create2DArray);
	this.codeRunner.addFunction("checkDefined",function(expression) {
		for (var i = 0; i < arguments.length; i++) {
			if (typeof arguments[i] == "undefined")
				return false;
		}
		return true;
	});
}

CellProcessor.prototype.init = function(gridWidth,gridHeight) {
	this.codeRunner.lazyAddFunction("setupGrid", function(gridWidth,gridHeight) {
		checkDefined(self.obj.init,self.obj.color);
		self.cells = create2DArray(gridWidth,gridHeight,self.obj.init);
		self.colors = create2DArray(gridWidth,gridHeight,function () {
			return self.obj.color(self.obj.init());
		});
	});
};

CellProcessor.prototype.setCode = function(code) {
	this.codeRunner.lazyAddFunction("setCode",function(code) {
		self.obj = eval("(" + code + ")");
	});
};

CellProcessor.prototype.onDrawOptions = function(callback) {
	this.codeRunner.lazyAddFunction("getDrawOptions",function(code) {
		checkDefined(self.obj.drawOptions,self.obj.init);
		
		var returnArray = [];
		for (var i = 0; i < self.obj.drawOptions.length; i++) {
			var cell = self.obj.drawOptions[0];
			var color = self.obj.color(cell);
			returnArray.push({cell:cell,color:color});
		}
		return returnArray;
	});
}

CellProcessor.prototype.onStep = function (callback) {
	this.onStepCallback = callback;
}

CellProcessor.prototype.requestNewStep = function (cells) {
	this.codeRunner.lazyAddFunction("step",function(cells) {
		checkDefined(self.obj.run,self.obj.color);

		for (var x = 0; x < self.cells.length; x++) {
			for (var y = 0; y < self.cells[x].length; y++) {
				var cell = self.cells[x][y];
				self.cells[x][y] = self.obj.run(cell);
				self.colors[x][y] = self.obj.color(cell);
			}
		}
		return [self.cells,self.colors];
	});
	this.codeRunner.runFunc("step",cells, function(cells,colors) {
		this.onStepCallback(cells,colors);
	});
}