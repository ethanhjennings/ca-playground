function timeStamp() {
    return +(new Date());
}

running = false;
var codeMirror;
var codeRunner;

function timeStamp() {
    return Date.now();
}

$(document).ready(function () {

    worker = new Worker("testspeed.js");
    var speeds = [];
    var time = timeStamp();
    function handleMessage(e) {
        if (speeds.length < 10000) {
            var now = timeStamp();
            speeds.push(now - time);
            time = now;
        }
        else {
            var avg = 0;
            for (var i = 0; i < speeds.length; i++) {
                avg += speeds[i];
            }
            console.log(avg/speeds.length)
        }
        worker.postMessage("test");
    };
    worker.addEventListener("message", handleMessage);

    handleMessage();

    var time = timeStamp();

    self.addEventListener()

    codeRunner = new CodeRunner();
    //runner.setupWorker({gridWidth:10,gridHeight:10,func:function() {console.log("yay!!!");}});

    codeMirror = CodeMirror.fromTextArea($("#codemirror-textbox")[0],{
        mode:  "javascript",
        theme: "glass",
        lineNumbers: true,
        indentUnit: 4
    });

    codeRunner.setCode(codeMirror.getValue());

    codeMirror.on("change",function(instance, changeObj) {
        codeRunner.setCode(codeMirror.getValue());
    });

    $('#ex1').slider();

    running = false;

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

    canvas = $("#main-canvas")[0];
    context = canvas.getContext("2d");

    context.canvas.width = $("#main-canvas").width();
    context.canvas.height = $("#main-canvas").height();

    width = context.canvas.width;
    height = context.canvas.height;

    grid = new Grid(width,height,10);
    data = [];
    for (var x = 0; x < grid.gridWidth; x++) {
        data.push([]);
        for (var y = 0; y < grid.gridHeight; y++) {
            data[x].push();
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
                data[point.x][point.y] = "white";
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

    counter = 0;

    runLoop();
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



function runLoop() {
    window.requestAnimationFrame(runLoop);
    if (running) {
        for (var i = 0; i < 1; i++) {
            /*newdata = [];
            for (var x = 0; x < grid.gridWidth; x++) {
                newdata.push([]);
                for (var y = 0; y < grid.gridHeight; y++) {
                    newdata[x].push(0);
                    //codeRunner.runFunc('run',function(state) {
                    //    newdata[x][y] = state;
                    //});
                    /*var count = countNeighbors({x:x,y:y});
                    if (count == 3)
                        newdata[x].push("white");
                    else if (count < 2)
                        newdata[x].push("rgba(0,0,0,0.0)");
                    else if (count > 3)
                        newdata[x].push("rgba(0,0,0,0.0)");
                    else
                        newdata[x].push(data[x][y]);
                }
            }
            data = newdata;*/
        }
    }          
    context.clearRect(0,0,canvas.width,canvas.height);
    grid.draw(context,data);
    counter = 0;
}
