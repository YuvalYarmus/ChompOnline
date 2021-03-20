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
    var gapX = Math.floor(width / 20);
    var gapY = Math.floor((height / 20));
    // calculating maximum bound radius
    var r = Math.floor(width > height
        ? (height * 0.85) /
            (rows > shapes_in_row ? 2 * rows : shapes_in_row * 2)
        : (width * 0.85) / (rows > shapes_in_row ? 2 * rows : shapes_in_row * 2));
    // calculating the gap between the space the shapes take and space the canvas has
    var dx = Math.round(width - 2 * r * shapes_in_row - (shapes_in_row + 1) * gapX);
    var dy = Math.round(height - 2 * r * rows - (rows + 1) * gapY);
    // calculating xI - the first x position we can a shape at
    // and yI - the first y position we can a shape at
    var xI = dx > 0
        ? Math.round(width - 2 * r * shapes_in_row - dx / 2 - gapX)
        : Math.round(width - 2 * r * shapes_in_row - (dx * 3) / 2 + r);
    var yI = dy > 0
        ? Math.round(height - 2 * r * rows - dy / 2 - gapY)
        : Math.round(height - 2 * r * rows - (dy * 3) / 2 + r);
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
                var x = Math.round(xI + j * (2 * r + gapX));
                var y = Math.round(yI + i * (2 * r + gapY));
                var shape = new Shape(x, y, r, i, j, curr_shape);
                shapes.push(shape);
            }
        }
    }
    this.updateGameStateShapes(shapes);
    return shapes;
}
