"use strict";
var Shape = /** @class */ (function () {
    function Shape(x, y, radius, i, j, shouldDraw) {
        if (shouldDraw === void 0) { shouldDraw = true; }
        this.id = i + "-" + j;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.i = i;
        this.j = j;
        this.shouldDraw = shouldDraw;
    }
    Shape.prototype.toString = function () {
        return "draw is " + this.shouldDraw + ", i is " + this.i + ", j is " + this.j;
    };
    return Shape;
}());
var GameStateObject = /** @class */ (function () {
    function GameStateObject() {
        this.array = [];
        this.shapes = [];
    }
    return GameStateObject;
}());
var Game = /** @class */ (function () {
    function Game() {
        var _this = this;
        // usability guidelines for the game_state array:
        // on creation, all the inner arrays must be set to the same length
        // deleting a shape can be executed by changing its position to false and than redrawing
        this.globalGameState = {
            array: [],
            shapes: [],
        };
        this.turns = 0; // if turns % 2 === 0 than it is player 1, if not - player 2
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            //document.documentElement.classList.add('dark')
            this.color = "#dbdbdb";
        }
        else
            this.color = "black";
        window.addEventListener("resize", function () {
            _this.resizeFunc();
        });
        this.canvas.addEventListener("click", function (e) {
            _this.clickFunc(e);
        });
        window.addEventListener("load", function () { return _this.promptGameState(); });
    }
    /**
     * redrawing the board on every page resize
     */
    Game.prototype.resizeFunc = function () {
        this.canvas.height = Math.round(window.innerHeight * 0.9);
        console.log("cavas height is " + this.canvas.height + " and mod2 is " + this.canvas.height % 2);
        this.canvas.height -= this.canvas.height % 2;
        this.canvas.width = Math.round(window.innerWidth * 0.9);
        console.log("cavas height is " + this.canvas.width + " and mod2 is " + this.canvas.width % 2);
        this.canvas.width -= this.canvas.width % 2;
        console.log("resize triggered width:" + this.canvas.width + ",height: " + this.canvas.height);
        this.fitShapesToCanvas(this.canvas, this.globalGameState);
        this.drawShapes(this.globalGameState.shapes);
    };
    /**
     * responds to user moves
     * @param e - the mouse events the represent user moves
     */
    Game.prototype.clickFunc = function (e) {
        var CANVASpos = this.getMousePos(e);
        for (var _i = 0, _a = this.globalGameState.shapes; _i < _a.length; _i++) {
            var circle = _a[_i];
            if (this.isIntersect(CANVASpos, circle) === true) {
                if (circle.i === this.globalGameState.array.length - 1 &&
                    circle.j === 0) {
                    this.turns++;
                    this.globalGameState.array = this.updateGameState(this.globalGameState.array, circle);
                    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                    console.log("THE GAME HAS ENDED");
                    document.getElementById("reserved").textContent = "The game has ended in " + this.turns + " turns, Player " + (this.turns % 2 == 0 ? 1 : 2) + " won! ";
                    // document.getElementById("Holder2")!.innerHTML = `<button class="bt" type="button">Would you like to play again? If so, click here!</button>`
                    // document.getElementById("Holder2")!.addEventListener("click", () => {
                    //   location.reload();
                    // });
                    document
                        .getElementById("Holder2")
                        .setAttribute("x-data", "{ open: true }");
                    break;
                }
                else {
                    this.turns++;
                    this.globalGameState.array = this.updateGameState(this.globalGameState.array, circle);
                    this.updateShapesDrawStateByArray();
                    this.drawShapes(this.globalGameState.shapes);
                }
            }
        }
    };
    /**
     * prompting the user to set the board size
     */
    Game.prototype.promptGameState = function () {
        var n = parseInt(prompt("Please enter the amount of rows you want (no more than 8)") || "8");
        var m = parseInt(prompt("Please enter the amount of columns you want (no more than 8)") ||
            "5");
        console.log("n is " + n + " and m is " + m);
        if (isNaN(n) || n > 8)
            n = 8;
        if (isNaN(m) || m > 8)
            m = 8;
        var arr = [];
        if (n != null && m != null) {
            for (var i = 0; i < n; i++) {
                arr.push([]);
                this.globalGameState.array.push([]);
                for (var j = 0; j < m; j++) {
                    arr[i].push(true);
                    this.globalGameState.array[i].push(true);
                }
            }
            console.log("\n\n");
            this.createShapesByArray(arr);
        }
    };
    Game.prototype.updateGameStateArray = function (gameStateArray) {
        this.globalGameState.array = gameStateArray;
    };
    Game.prototype.updateGameStateShapes = function (gameStateShapes) {
        this.globalGameState.shapes = gameStateShapes;
    };
    Game.prototype.fitShapesToCanvas = function (canvas, game_state) {
        // declaring constants
        var width = canvas.width;
        var height = canvas.height;
        var rows = game_state.array.length;
        var shapes_in_row = game_state.array[0].length;
        // declaring an array which will eventually include all the shapes
        var shapes = [];
        // 85% circles, 10% gap, 5% deltas
        // empty space gap from the corners (from both sides)
        var gapX = Math.floor(width * 0.1 * 0.5);
        var gapY = Math.floor((height * 0.1 * 0.5));
        // calculating maximum bound radius
        var r = Math.floor(width > height ?
            ((height * 0.85) / (rows > shapes_in_row ? rows : shapes_in_row)) / 2
            : ((width * 0.85) / (rows > shapes_in_row ? rows : shapes_in_row)) / 2);
        // calculating the gap between the space the shapes take and space the canvas has
        var dx = Math.round((width * 0.05) / (shapes_in_row - 1));
        var dy = Math.round((height * 0.05) / (rows - 1));
        // calculating xI - the first x position we can a shape at
        // and yI - the first y position we can a shape at
        var xI = gapX + r, xE = gapX + 2 * r * shapes_in_row + dx * (shapes_in_row - 1);
        var yI = gapY + r, yE = gapY + 2 * r * rows + dy * (rows - 1);
        // creating the shapes
        for (var i = 0; i < rows; i++) {
            var curr_row = game_state.array[i];
            for (var j = 0; j < curr_row.length; j++) {
                var curr_shape = curr_row[j];
                if (curr_shape != null) {
                    var count_dx = (j) * dx > 0 ? (j) * dx : 0;
                    var count_dy = (i) * dy > 0 ? (i) * dy : 0;
                    var fix_lean = (width - xE + r) < 0 || Math.abs(width - xE + r) / 4 + xE > width ? 0 : (width - xE) / 4;
                    var x = Math.round(xI + j * 2 * r + count_dx + fix_lean);
                    var y = Math.round(yI + i * 2 * r + count_dy);
                    var shape = new Shape(x, y, r, i, j, curr_shape);
                    shapes.push(shape);
                }
            }
        }
        this.updateGameStateShapes(shapes);
        return shapes;
    };
    /**
     * sets all values to true
     * should only run once in the beginning of each game
     * to change the shapes from true please use the updateShapesDrawStateByArray
     * @param currGameState
     */
    Game.prototype.createShapesByArray = function (currGameState) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.canvas.height = Math.round(window.innerHeight * 0.9);
        console.log("cavas height is " + this.canvas.height + " and mod2 is " + this.canvas.height % 2);
        this.canvas.height -= this.canvas.height % 2;
        this.canvas.width = Math.round(window.innerWidth * 0.9);
        console.log("cavas height is " + this.canvas.width + " and mod2 is " + this.canvas.width % 2);
        this.canvas.width -= this.canvas.width % 2;
        var shapes = [];
        var rows = currGameState.length;
        var shapes_in_row = currGameState[currGameState.length - 1].length;
        shapes = this.fitShapesToCanvas(this.canvas, this.globalGameState);
        this.drawShapes(shapes);
    };
    Game.prototype.updateShapesDrawStateByArray = function () {
        for (var _i = 0, _a = this.globalGameState.shapes; _i < _a.length; _i++) {
            var circle = _a[_i];
            circle.shouldDraw = this.globalGameState.array[circle.i][circle.j];
        }
    };
    Game.prototype.drawShapesByGameState = function (currGameState) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (var _i = 0, _a = currGameState.shapes; _i < _a.length; _i++) {
            var circle = _a[_i];
            if (circle.shouldDraw) {
                this.ctx.beginPath();
                this.ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI, false);
                this.ctx.fillStyle = "black";
                this.ctx.fill();
            }
        }
    };
    Game.prototype.drawShapes = function (shapes) {
        if (shapes === void 0) { shapes = this.globalGameState.shapes; }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (var _i = 0, shapes_1 = shapes; _i < shapes_1.length; _i++) {
            var circle = shapes_1[_i];
            if (circle.shouldDraw === true) {
                this.ctx.beginPath();
                this.ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI, false);
                // this.ctx.fillStyle = "black";
                this.ctx.fillStyle = this.color;
                this.ctx.fill();
            }
        }
    };
    Game.prototype.updateGameState = function (currGameState, circle) {
        // all shapes above and to the right should be turned to false
        for (var i = 0; i <= circle.i; i++) {
            var curr_row = currGameState[i];
            for (var j = curr_row.length - 1; j >= circle.j; j--) {
                curr_row[j] = false;
            }
        }
        return currGameState;
    };
    Game.prototype.isIntersect = function (point, circle) {
        var distance = Math.sqrt(Math.pow(point.x - circle.x, 2) + Math.pow(point.y - circle.y, 2));
        return distance < circle.radius;
    };
    Game.prototype.getMousePos = function (e) {
        var rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            rectX: rect.x,
            eveX: e.pageX,
            rectY: rect.y,
            eveY: e.pageY,
        };
    };
    return Game;
}());
// console.clear();
var game = new Game();
