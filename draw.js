var self = this;

$(document).ready(function () {

    self.codeMirror = CodeMirror.fromTextArea($("#codemirror-textbox")[0],{
        mode:  "javascript",
        theme: "glass",
        lineNumbers: true,
        indentUnit: 4
    });

    self.codeMirror.on("change",function(instance, changeObj) {
        self.cellProcessor.setCode(codeMirror.getValue());
    });

    self.canvas = $("#main-canvas")[0];
    self.context = self.canvas.getContext("2d");

    self.context.canvas.width = $("#main-canvas").width();
    self.context.canvas.height = $("#main-canvas").height();

    self.width = self.context.canvas.width;
    self.height = self.context.canvas.height;


    self.code = self.codeMirror.getValue();
    self.grid = new Grid(self.width,self.height,10);

    self.gridModified = false;

    self.cellProcessor = new CellProcessor();
    self.cellProcessor.setCode(self.codeMirror.getValue());
    self.cellProcessor.onStep(cellsChanged);
    self.cellProcessor.init(self.grid.gridWidth,self.grid.gridHeight);
    self.cellProcessor.onDrawOptions(function (drawOptions) {
        self.drawOptions = drawOptions;
    });
    /*self.cellProcessor.onError(function (error,linenum) {
        alert("error! " + error);
    });*/

    $('#ex1').slider();

    self.running = false;

    $("#play-button").click(function () {

        self.running = !self.running;

        $("#play-icon").removeClass();
        if (self.running) {
            self.cellProcessor.requestNewStep(this.cells,cellsChanged);
            console.log("Running!");
            $("#play-icon").addClass("glyphicon glyphicon-pause");
            $("#run-text").text("Pause");
        }
        else {

            console.log("Paused !");
            $("#play-icon").addClass("glyphicon glyphicon-play");
            $("#run-text").text("Run");
        }
    });
    

    function getXY(event) {
        return {x:event.clientX-self.canvas.offsetLeft-3, 
                y:event.clientY-self.canvas.offsetTop+5};
    }

    var lastMousePos;
    var mouseDown = false;
    $(self.canvas).mousedown(function(event) {
        mouseDown = true;
        lastMousePos = getXY(event);
    });
    $("body").mousemove(function(mousemoveEvent) {
        mousemoveEvent.originalEvent.preventDefault();
        if (mouseDown) {
            var newPoints = grid.convertLineToGridPoints(lastMousePos,getXY(mousemoveEvent));
            $.each(newPoints, function(i,point) {
                this.cells[point.x][point.y] = this.drawOptions[0].state;
                this.colors[point.x][point.y] = this.drawOptions[0].color;
            });
            lastMousePos = getXY(mousemoveEvent);

            this.gridModified = true;
        }
    });

    $("body").mouseup(function (event) {
        mouseDown = false;
        lastMousePos = getXY(event);
    });

    // makes the lines crisper
    self.context.translate(-0.5,-0.5);

    //window.requestAnimationFrame(draw);
});


function getWrappedPos(pos) {
    var result = pos;
    while (result.x < 0)
        result.x += grid.gridWidth;
    while (result.y < 0)
        result.y += grid.gridWidth;
    while (result.x >= grid.gridWidth)
        result.x -= grid.gridWidth;
    while (result.y >= grid.gridHeight)
        result.y -= grid.gridHeight;
    return result;
}

function result(pos) {
    pos = getWrappedPos(pos);
    if ((data[pos.x][pos.y]) == "white")
        return true;
    else
        return false;
}

function countNeighbors(pos) {
    var neighborCount = 0;
    for (var x = -1; x <= 1; x++) {
        for (var y = -1; y <= 1; y++) {
            if (!(x == 0 && y == 0) && result({x:pos.x+x,y:pos.y+y}) == true) {
                neighborCount += 1;
            }
        }
    }
    return neighborCount;
}

function cellsChanged(newCells,newColors) {
    if (!this.gridModified) {
        self.colors = newColors;
        this.cells = newCells;
        invalidateCells();
    }
    self.gridModified = false;
    self.cellProcessor.requestNewStep(this.cells,cellsChanged);
}

function invalidateCells() {
    window.requestAnimationFrame(draw);
}

function draw() {
    self.context.clearRect(0,0,self.canvas.width,self.canvas.height);
    self.grid.draw(self.context,self.colors);
}
