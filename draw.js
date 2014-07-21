function timeStamp() {
    return +(new Date());
}

$(document).ready(function () {
    var codeMirror = CodeMirror.fromTextArea($("#codemirror-textbox")[0],{
        mode:  "javascript",
        theme: "glass",
        lineNumbers: true,
        indentUnit: 4
    });

    $('#ex1').slider();

    var running = false;

    $("#play-button").click(function () {

        running = !running;

        $("#play-icon").removeClass();
        if (running) {
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

    var canvas = $("#main-canvas")[0];
    var context = canvas.getContext("2d");

    context.canvas.width = $("#main-canvas").width();
    context.canvas.height = $("#main-canvas").height();

    var width = context.canvas.width;
    var height = context.canvas.height;

    grid = new Grid(width,height,10);
    var colorData = [];
    for (var x = 0; x < grid.gridWidth; x++) {
        colorData.push([]);
        for (var y = 0; y < grid.gridHeight; y++) {
            colorData[x].push("rgba(0,0,0,0.0)");
        }
    }
    var lastMousePos;

    function getXY(event) {
        return {x:event.clientX-canvas.offsetLeft-3, 
                y:event.clientY-canvas.offsetTop+5};
    }
    var mouseDown = false;
    $(canvas).mousedown(function(event) {
        mouseDown = true;
        lastMousePos = getXY(event);
    });
    $("body").mousemove(function(mousemoveEvent) {
        mousemoveEvent.originalEvent.preventDefault();
        if (mouseDown) {
            var newPoints = grid.convertLineToGridPoints(lastMousePos,getXY(mousemoveEvent));
            $.each(newPoints, function(i,point) {
                colorData[point.x][point.y] = "white";
            });
            lastMousePos = getXY(mousemoveEvent);
        }
    });

    $("body").mouseup(function (event) {
        mouseDown = false;
        lastMousePos = getXY(event);
    });

    // makes the lines crisper
    context.translate(-0.5,-0.5);

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
        if ((colorData[pos.x][pos.y]) == "white")
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

    counter = 0;

    runLoop();
});



function runLoop() {
    window.requestAnimationFrame(runLoop);
    if (running) {
        for (var i = 0; i < 1; i++) {
            newColorData = [];
            for (var x = 0; x < grid.gridWidth; x++) {
                newColorData.push([]);
                for (var y = 0; y < grid.gridHeight; y++) {
                    var count = countNeighbors({x:x,y:y});
                    if (count == 3)
                        newColorData[x].push("white");
                    else if (count < 2)
                        newColorData[x].push("rgba(0,0,0,0.0)");
                    else if (count > 3)
                        newColorData[x].push("rgba(0,0,0,0.0)");
                    else
                        newColorData[x].push(colorData[x][y]);
                }
            }
            colorData = newColorData;
        }
    }          
    context.clearRect(0,0,canvas.width,canvas.height);
    grid.draw(context,colorData);
    counter = 0;
}
