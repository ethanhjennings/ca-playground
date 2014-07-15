$(document).ready(function () {
    var canvas = $("#main-canvas")[0];
    var context = canvas.getContext("2d");

    var width = canvas.width;
    var height = canvas.height;

    var x = 0;

    // makes the lines crisper
    context.translate(-0.5,-0.5);

    (function runLoop() {
        window.requestAnimationFrame(runLoop);
        context.clearRect(0,0,canvas.width,canvas.height);

        var CELL_SIZE = 10;
        var gridWidth = width/CELL_SIZE;
        var gridHeight = height/CELL_SIZE;

        context.lineWidth="1";
        context.strokeStyle="rgba(255,255,255,0.2)";

        for (var x = 0; x < gridWidth; x++) {
            context.beginPath();
            context.moveTo(x*CELL_SIZE,0);
            context.lineTo(x*CELL_SIZE,height);
            context.stroke();
        }
    
        for (var y = 0; y < gridHeight; y++) {
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

    })();
});
