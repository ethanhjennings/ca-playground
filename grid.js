function grid(width,height,cellsize) {
	this.cellSize = cellSize;
	this.gridWidth = width/CELL_SIZE;
    this.gridHeight = height/CELL_SIZE;
    this.width = width;
    this.height = height;
    this.decimalCellWidth = this.width/this.gridWidth;
    this.decimalCellHeight = this.height/this.gridWidth;
}

grid.prototype.draw = function(context) {
        context.lineWidth="1";
        context.strokeStyle="rgba(255,255,255,0.2)";



        for (var x = 0; x < this.gridWidth; x++) {
            var xPos = (int)(x*this.decimalCellWidth);

            context.beginPath();
            context.moveTo(xPos,0);
            context.lineTo(xPos,height);
            context.stroke();
        }
    
        for (var y = 0; y < this.gridHeight; y++) {
            var yPos = (int)(y*this.decimalCellHeight);

            context.beginPath();
            context.moveTo(0,y*CELL_SIZE);
            context.lineTo(width,y*CELL_SIZE);
            context.stroke();
        }

        context.fillStyle = "rgba(255,255,255,1.0)";

        for (var y = 0; y < gridHeight; y++) {
            for (var x = 0; x < gridWidth; x++) {
                if (Math.random() > 0.5) {
                    context.fillRect(x*CELL_SIZE,y*CELL_SIZE,CELL_SIZE,CELL_SIZE);
                }
            }
        }
};