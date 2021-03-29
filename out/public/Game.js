class Shape {
    constructor(x, y, radius, i, j, shouldDraw = true) {
        this.id = `${i}-${j}`;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.i = i;
        this.j = j;
        this.shouldDraw = shouldDraw;
    }
    toString() {
        return `draw is ${this.shouldDraw}, i is ${this.i}, j is ${this.j}`;
    }
}
class GameStateObject {
    constructor() {
        this.array = [];
        this.shapes = [];
    }
}
export default class Game {
    constructor() {
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
        window.addEventListener("resize", () => {
            this.resizeFunc();
        });
        this.canvas.addEventListener("click", (e) => {
            this.clickFunc(e);
        });
        window.addEventListener("load", () => this.promptGameState());
    }
    /**
     * redrawing the board on every page resize
     */
    resizeFunc() {
        this.canvas.height = Math.round(window.innerHeight * 0.9);
        console.log(`cavas height is ${this.canvas.height} and mod2 is ${this.canvas.height % 2}`);
        this.canvas.height -= this.canvas.height % 2;
        this.canvas.width = Math.round(window.innerWidth * 0.9);
        console.log(`cavas height is ${this.canvas.width} and mod2 is ${this.canvas.width % 2}`);
        this.canvas.width -= this.canvas.width % 2;
        console.log(`resize triggered width:${this.canvas.width},height: ${this.canvas.height}`);
        this.fitShapesToCanvas(this.canvas, this.globalGameState);
        this.drawShapes(this.globalGameState.shapes);
    }
    /**
     * responds to user moves
     * @param e - the mouse events the represent user moves
     */
    clickFunc(e) {
        const CANVASpos = this.getMousePos(e);
        for (const circle of this.globalGameState.shapes) {
            if (this.isIntersect(CANVASpos, circle) === true) {
                if (circle.i === this.globalGameState.array.length - 1 &&
                    circle.j === 0) {
                    this.turns++;
                    this.globalGameState.array = this.updateGameState(this.globalGameState.array, circle);
                    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                    console.log("THE GAME HAS ENDED");
                    document.getElementById("reserved").textContent = `The game has ended in ${this.turns} turns, Player ${this.turns % 2 == 0 ? 1 : 2} won! `;
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
    }
    /**
     * prompting the user to set the board size
     */
    promptGameState() {
        let n = parseInt(prompt("Please enter the amount of rows you want (no more than 8)") || "8");
        let m = parseInt(prompt("Please enter the amount of columns you want (no more than 8)") ||
            "5");
        console.log(`n is ${n} and m is ${m}`);
        if (isNaN(n) || n > 8)
            n = 8;
        if (isNaN(m) || m > 8)
            m = 8;
        let arr = [];
        if (n != null && m != null) {
            for (let i = 0; i < n; i++) {
                arr.push([]);
                this.globalGameState.array.push([]);
                for (let j = 0; j < m; j++) {
                    arr[i].push(true);
                    this.globalGameState.array[i].push(true);
                }
            }
            console.log(`\n\n`);
            this.createShapesByArray(arr);
        }
    }
    updateGameStateArray(gameStateArray) {
        this.globalGameState.array = gameStateArray;
    }
    updateGameStateShapes(gameStateShapes) {
        this.globalGameState.shapes = gameStateShapes;
    }
    fitShapesToCanvas(canvas, game_state) {
        // declaring constants
        const width = canvas.width;
        const height = canvas.height;
        const rows = game_state.array.length;
        const shapes_in_row = game_state.array[0].length;
        // declaring an array which will eventually include all the shapes
        let shapes = [];
        // 85% circles, 10% gap, 5% deltas
        // empty space gap from the corners (from both sides)
        const gapX = Math.floor(width * 0.1 * 0.5);
        const gapY = Math.floor((height * 0.1 * 0.5));
        // calculating maximum bound radius
        const r = Math.floor(width > height ?
            ((height * 0.85) / (rows > shapes_in_row ? rows : shapes_in_row)) / 2
            : ((width * 0.85) / (rows > shapes_in_row ? rows : shapes_in_row)) / 2);
        // calculating the gap between the space the shapes take and space the canvas has
        const dx = Math.round((width * 0.05) / (shapes_in_row - 1));
        const dy = Math.round((height * 0.05) / (rows - 1));
        // calculating xI - the first x position we can a shape at
        // and yI - the first y position we can a shape at
        const xI = gapX + r, xE = gapX + 2 * r * shapes_in_row + dx * (shapes_in_row - 1);
        const yI = gapY + r, yE = gapY + 2 * r * rows + dy * (rows - 1);
        // creating the shapes
        for (let i = 0; i < rows; i++) {
            const curr_row = game_state.array[i];
            for (let j = 0; j < curr_row.length; j++) {
                let curr_shape = curr_row[j];
                if (curr_shape != null) {
                    let count_dx = (j) * dx > 0 ? (j) * dx : 0;
                    let count_dy = (i) * dy > 0 ? (i) * dy : 0;
                    let fix_lean = (width - xE + r) < 0 || Math.abs(width - xE + r) / 4 + xE > width ? 0 : (width - xE) / 4;
                    const x = Math.round(xI + j * 2 * r + count_dx + fix_lean);
                    const y = Math.round(yI + i * 2 * r + count_dy);
                    let shape = new Shape(x, y, r, i, j, curr_shape);
                    shapes.push(shape);
                }
            }
        }
        this.updateGameStateShapes(shapes);
        return shapes;
    }
    /**
     * sets all values to true
     * should only run once in the beginning of each game
     * to change the shapes from true please use the updateShapesDrawStateByArray
     * @param currGameState
     */
    createShapesByArray(currGameState) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.canvas.height = Math.round(window.innerHeight * 0.9);
        console.log(`cavas height is ${this.canvas.height} and mod2 is ${this.canvas.height % 2}`);
        this.canvas.height -= this.canvas.height % 2;
        this.canvas.width = Math.round(window.innerWidth * 0.9);
        console.log(`cavas height is ${this.canvas.width} and mod2 is ${this.canvas.width % 2}`);
        this.canvas.width -= this.canvas.width % 2;
        let shapes = [];
        var rows = currGameState.length;
        var shapes_in_row = currGameState[currGameState.length - 1].length;
        shapes = this.fitShapesToCanvas(this.canvas, this.globalGameState);
        this.drawShapes(shapes);
    }
    updateShapesDrawStateByArray() {
        for (const circle of this.globalGameState.shapes) {
            circle.shouldDraw = this.globalGameState.array[circle.i][circle.j];
        }
    }
    drawShapesByGameState(currGameState) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (const circle of currGameState.shapes) {
            if (circle.shouldDraw) {
                this.ctx.beginPath();
                this.ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI, false);
                this.ctx.fillStyle = "black";
                this.ctx.fill();
            }
        }
    }
    drawShapes(shapes = this.globalGameState.shapes) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (const circle of shapes) {
            if (circle.shouldDraw === true) {
                this.ctx.beginPath();
                this.ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI, false);
                // this.ctx.fillStyle = "black";
                this.ctx.fillStyle = this.color;
                this.ctx.fill();
            }
        }
    }
    updateGameState(currGameState, circle) {
        // all shapes above and to the right should be turned to false
        for (let i = 0; i <= circle.i; i++) {
            let curr_row = currGameState[i];
            for (let j = curr_row.length - 1; j >= circle.j; j--) {
                curr_row[j] = false;
            }
        }
        return currGameState;
    }
    isIntersect(point, circle) {
        const distance = Math.sqrt(Math.pow(point.x - circle.x, 2) + Math.pow(point.y - circle.y, 2));
        return distance < circle.radius;
    }
    getMousePos(e) {
        var rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            rectX: rect.x,
            eveX: e.pageX,
            rectY: rect.y,
            eveY: e.pageY,
        };
    }
}
