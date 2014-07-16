function Grid(width,height,cellsize) {
	this.cellSize = cellsize;
	this.gridWidth = width/this.cellSize;
    this.gridHeight = height/this.cellSize;
    this.width = width;
    this.height = height;
    this.decimalCellWidth = this.width/this.gridWidth;
    this.decimalCellHeight = this.height/this.gridHeight;
}

Grid.prototype.convertPointToGridPoint = function(point) {
    return {x:Math.floor(point.x/this.decimalCellWidth), 
            y:Math.floor(point.y/this.decimalCellHeight)};
}

Grid.prototype.convertLineToGridPoints = function(startPoint,endPoint) {
    // use Bresenham's algorithm
    startPoint = this.convertPointToGridPoint(startPoint);
    endPoint = this.convertPointToGridPoint(endPoint);
    var x0 = startPoint.x;
    var y0 = startPoint.y;
    var x1 = endPoint.x;
    var y1 = endPoint.y;
    var dx = Math.abs(x1-x0);
    var dy = Math.abs(y1-y0);
    var sx = (x0 < x1) ? 1 : -1;
    var sy = (y0 < y1) ? 1 : -1;
    var err = dx-dy;

    var resultArray = [];

    while(true){
        var point ={x:x0,y:y0};
        if (point.x >= 0 && point.x < this.gridWidth &&
            point.y >= 0 && point.y < this.gridHeight) 
            resultArray.push(point);

        if ((x0==x1) && (y0==y1)) break;
        var e2 = 2*err;
        if (e2 >-dy){ err -= dy; x0  += sx; }
        if (e2 < dx){ err += dx; y0  += sy; }
    }

    return resultArray;
}


Grid.prototype.draw = function(context,colorData) {
    context.lineWidth="1";
    context.strokeStyle="rgba(255,255,255,0.2)";

    for (var x = 0; x < this.gridWidth; x++) {
        var xPos = Math.floor(x*this.decimalCellWidth);

        context.beginPath();
        context.moveTo(xPos,0);
        context.lineTo(xPos,this.height);
        context.stroke();
    }

    for (var y = 0; y < this.gridHeight; y++) {
        var yPos = Math.floor(y*this.decimalCellHeight);

        context.beginPath();
        context.moveTo(0,yPos);
        context.lineTo(this.width,yPos);
        context.stroke();
    }

    for (var y = 0; y < this.gridHeight; y++) {
        for (var x = 0; x < this.gridWidth; x++) {
            context.strokeWidth = "0";
            context.fillStyle = colorData[x][y];
            context.fillRect(x*this.cellSize-0.5,y*this.cellSize-0.5,this.cellSize+1.0,this.cellSize+1.0);
        }
    }
};
