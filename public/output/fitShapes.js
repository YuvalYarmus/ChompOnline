"use strict";
fitShapesToCanvas(canvas, HTMLCanvasElement, game_state, GameState);
{
    // declaring constants
    var width = canvas.width;
    var height = canvas.height;
    var rows = game_state.array.length;
    var shapes_in_row = game_state.array[0].length;
    // declaring an array which will eventually include all the shapes
    var shapes = [];
    // empty space gap from the corners
    var gapX = Math.floor(width / 40);
    var gapY = Math.floor((height / 40));
    // calculating maximum bound radius
    var r = Math.floor(width > height ?
        ((height * 0.85) / (rows > shapes_in_row ? rows : shapes_in_row)) / 2
        : ((width * 0.85) / (rows > shapes_in_row ? rows : shapes_in_row)) / 2);
    // calculating the gap between the space the shapes take and space the canvas has
    var dx = Math.round((width * 0.85) / (shapes_in_row - 1));
    var dy = Math.round((height * 0.85) / (rows - 1));
    // calculating xI - the first x position we can a shape at
    // and yI - the first y position we can a shape at
    var xI = gapX + r, xE = gapX + (r + dx) * shapes_in_row - dx;
    var yI = gapY + r, yE = gapY + (r + dy) * rows - dy;
    // logs
    console.log("rows is [" + rows + "], shapes_in_row: [" + shapes_in_row + "]");
    console.log("window height [" + window.innerHeight + "], window width: [" + window.innerWidth + "]\n\n      canvas height: [" + height + "], canvas width: [" + width + "]");
    console.log("gapX [" + gapX + "], gapY [" + gapY + "]");
    console.log("the radius is [" + r + "], would have been [" + (height * 0.9) / (rows > shapes_in_row ? 2 * rows : shapes_in_row * 2) + "]");
    console.log("dx is [" + dx + "], dy is [" + dy + "]");
    console.log("xI is [" + xI + "], yI is " + yI);
    // creating the shapes
    for (var i = 0; i < rows; i++) {
        var curr_row = game_state.array[i];
        for (var j = 0; j < curr_row.length; j++) {
            var curr_shape = curr_row[j];
            if (curr_shape != null) {
                var x = Math.round(gapX + j * r + (j - 1) * dx);
                var y = Math.round(gapY + i * r + (i - 1) * dy);
                var shape = new Shape(x, y, r, i, j, curr_shape);
                shapes.push(shape);
            }
        }
    }
    this.updateGameStateShapes(shapes);
    return shapes;
}
