// an idea: represnt the game as a byte string

import {Game, Shape} from "./Game";
declare var Qs: any;
// option 1: a string which length is the amount of columns and the value in each spot the
// height of the column (how many rows)

// 
document.getElementById("soundControl")!.innerHTML = `
<label class="switch">
<input id="soundSett" type="checkbox" checked>
<span class="slider"></span>
</label>`
;
var soundOn = true;
document.getElementById("soundSett")!.addEventListener(`change`, () => {
  soundOn = !soundOn;
});
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
class Bot extends Game {
    currGameString : string;
    n : number; // number of rows
    m : number; // number of columns
    constructor(n: number , m: number) {
        super();
        this.currGameString = this.createGameString(n, m);
        this.n = n;
        this.m = m;
    }
    
    createGameString(n : number, m : number) : string {
        let string = "" 
        for (let i = 0; i < m; i++) {
            string += (n-1).toString()
        }
        return string
    }
    
    computeMove(gameString : string, i : number, j : number) {
        // pressing the poisioned piece
        if (i === 0 && j === 0) return "";
        // pressing on the ground row
        else if (i === 0) return gameString.slice(0, j);
        // pressing on the first column
        else if (j === 0) {
            let string = (i - 1).toString();
            for(let index = 1; index < gameString.length; index++) {
                if (parseInt(gameString[index]) > i - 1) string += (i-1).toString();
                else string += gameString[index]
            }
            return string;
        }
        let string : string = ""
        if (j === 1) string = gameString[0];
        else string = gameString.slice(0, j);
        // console.log(`computeMove(${gameString} of len: ${gameString.length}, ${i}, ${j}) starting with string: ${string}`)
        for(let index = j; index < gameString.length; index++) {
            // height below the action:
            // console.log(`index is: ${index} and in its place: ${gameString[index]}`)
            if (parseInt(gameString[index]) < i) {
                string += gameString[index];
                // console.log(`parseInt(${gameString[index]}) < ${i} was true so now string is: ${string}`)
            } 
            // same or above the action height (action height - i can not be 0)
            else {
                string += (i -1).toString();
                // console.log(`parseInt(${gameString[index]}) < ${i} was false so now string is: ${string}`)
            }
        }
        return string;
    }
    
    movesInOne(gameString : string) : string[] | null {
        if (gameString === null || gameString === undefined) return null;
        else if (gameString === "0") return [""];
        let moves : string[] = [];
        for (let j = 0; j < gameString.length; j++) 
        for(let i = 0; i < parseInt(gameString[j]) + 1; i++)
        moves.push(this.memoizedComp(gameString, i, j));
        return moves;
    }
    
    isSquare(gameString:string) : boolean {
        // console.log(`game in square is: ${gameString}`)
        if (gameString === (null || undefined || "0")) return false;
        // console.log(`isSquare passed the valid`)
        let height = gameString[0]
        for(let j = 0; j < gameString.length; j++)
        if(gameString[j] != height) return false;
        return parseInt(height) + 1 === gameString.length;
    }
    
    memoizeComp(func : Function) : Function {
        let cache : {[key : string] : string} = {}
        const memoized = (gameString : string, i : number, j : number) => {
            let key : string =  gameString + `[${i}][${j}]`;
            if (cache[key] != (undefined && null))
            return cache[key];
            let result = func(gameString, i, j);
            cache[key] = result;
            return result;
        }
        return memoized;
    }
    
    memoizeAlphaSquare(func :Function) : Function {
        let cache : {[key : string] : boolean} = {};
        const memoized = (gameString : string) => {
            if (typeof gameString != "string") console.log(`gameString isnt string: ${gameString}`);
            if (cache[gameString] != undefined && cache[gameString] != null)
                return cache[gameString];
            // console.log(`func is: ${func}`)
            // if(func(gameString) === undefined) {
            //     console.log(`gameString: ${gameString}, func is: ${func}, res is: ${func(gameString)}`)
            // }
            let bindFunc = func.bind(this);
            let res = bindFunc(gameString);
            cache[gameString] = res;
            return res;
        }
        return memoized;
    }
    
    memoizedComp = this.memoizeComp(this.computeMove).bind(this);
    memoizedAlpha = this.memoizeAlphaSquare(this.alphabeta).bind(this);
    memoizedSquare = this.memoizeAlphaSquare(this.isSquare).bind(this);
    
    win(gameString : string) : string | undefined { 
        console.log(`\ngameString from win is: ${gameString}`)
        if (gameString === (null || undefined || "0")) return undefined;
        else if (this.memoizedSquare(gameString) === undefined) {
            console.log(`gameString: ${gameString} and square returned undefined`)
            return "--1";
        }
        else if(this.memoizedSquare(gameString)) return this.computeMove(gameString, 1, 1);
        let moves : string[] = this.movesInOne(gameString)!;
        if (typeof moves != "object") throw new Error(`moves is not an array: ${moves}`)
        for(let move of moves!) {
            let has_a_win = this.memoizedAlpha(move);
            if(has_a_win === undefined) throw new Error("has a win is undefined, move is " + move);
            if (!has_a_win) return move;
        }
        // if we can not win for in any of this positions, we will just a pick a random one
        // should be the larget one
        return moves[moves?.length - 1];
        // return "-1";
    }
    alphabeta(gameString: string) : boolean | undefined {
        // console.log(`gameString from alphabeta is: ${gameString}`)
        if(gameString === null || gameString === undefined) return undefined;
        else if(gameString === "") return true;
        // console.log(`in alphabeta: ${gameString}`)
        if (typeof gameString != "string") console.log(`gameString isnt string: ${gameString}`);
        // console.log(`gameString of type: ${typeof gameString} - ${gameString} - this is: ${this}`);
        if(this.memoizedSquare(gameString)) return true;
        // if(this.memoizedSquare(gameString)) return true;
        let moves = this.movesInOne(gameString);
        // console.log(`moves is: ${moves}`)
        for(let move of moves!) {
            if (!this.memoizedAlpha(move)) return true;
        }
        return false;
    }
    
    updateGameString(i : number, j : number) {
        console.log(`updateGameString with: ${i}, ${j}`);
        this.currGameString = this.computeMove(this.currGameString, i, j);
    }
    printState() {
        console.log(`\ngame_state:`)
        for (let i =0; i < this.globalGameState.array.length; i++) {
            console.log(`at ${i}:  ${this.globalGameState.array[i]}`)
        }
    }

    promptGameState() {
        super.promptGameState();
        this.currGameString = this.createGameString(this.globalGameState.array.length, this.globalGameState.array[0].length);
        this.n = this.globalGameState.array.length;
        this.m = this.globalGameState.array[0].length;
        // console.log(`after prompt gameState: ${this.globalGameState.array}`)
        // console.log(`after prompt gameString: ${this.currGameString}`)
    }

    gameStateByString(gameString : string) {
        console.log(`\ngameState by string with: ${gameString}`)
        // let arr : boolean[][] = [];
        // for(let index = 0; index < parseInt(gameString[0]) + 1; index++) {
        //     // index is the current row height
        //     arr.unshift([]);
        //     for(let j = 0; j < gameString.length; j++) {
        //         if(parseInt(gameString[j]) <= index) arr[index].push(true);
        //     }
        // }
        // console.log(`final array is: ${arr}\n`);
        // return arr;
        
    }
    updateGameStateByString() {
        
        // bot.n - circlePos[0] - 1
        let a = this.globalGameState.array;
        // console.log(`string at update gameState: ${this.currGameString}`)
        for (let index = 0; index < a.length; index++) {
            for (let j = 0; j < a[index].length; j++) {
                if (j >= this.currGameString.length) {
                    // console.log(`index : ${index}, j: ${j}, string at j: ${this.currGameString[j]} so set to false`)
                    this.globalGameState.array[index][j] = false;
                }
                else  {
                    if (this.n - index - 1 > parseInt(this.currGameString[j]) ) this.globalGameState.array[index][j] = false;
                    // if (index > this.n - parseInt(this.currGameString[j]) - 1) a[index][j] = false;
                    // console.log(`index : ${index}, j: ${j}, string at j: ${this.currGameString[j]} so -> ${a[index][j]}`)
                    // console.log(`this.n - parseInt(this.currGameString[j]) - 1: ${this.n - parseInt(this.currGameString[j]) - 1}`)
                }
            }
        }
        // console.log(`gameState after update for ${this.currGameString   } is: ${this.globalGameState.array}`);
        // this.printState();
    }
    updateShapesByString() {
        // console.log(`this is: ${this}`)
        for (const circle of this.globalGameState.shapes) {
            if (parseInt(this.currGameString[circle.j]) <= circle.i) circle.shouldDraw = true;
            else circle.shouldDraw = false;
        }
    }
    
}
// String.prototype.replaceAt = function(index, replacement) {
//     return this.substr(0, index) + replacement + this.substr(index + replacement.length);
// }
let replaceAt = function(og : string, index : number, replacement : string) : string {
    return og.substr(0, index) + replacement + og.substr(index + replacement.length);
}
const gameAudio = document.createElement(`audio`);
gameAudio.src = "../../gameTurn.mp3";
const { full_name, n, m } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });

if ( (n && m) != (null && undefined)) {
    let bot = new Bot(n, m);
    console.log(`win pos: ${bot.win(bot.currGameString)}`);
    canvas.addEventListener("click", (e) => {
        // console.log(`at start: ${bot.currGameString}`)
        let circlePos : number[] = bot.clickFunc(e);
        if (circlePos[0] != -1) {
            if (soundOn) gameAudio.play();
            // console.log(`circlePos: ${circlePos}`)
            bot.updateGameString(bot.n - circlePos[0] - 1, circlePos[1]!);
            console.log(`game string: ${bot.currGameString}`);
            let winString : string | undefined = bot.win(bot.currGameString);
            if (winString === undefined) {
                console.log(`probably had a problem with gameString - ${bot.currGameString}, win is undefined`);
                throw new Error(`probably had a problem with gameString - ${bot.currGameString}, win is undefined`);
            } 
            else {
                console.log(`winString is:  ${winString}`);
                // bot.replaceGameStateArray(bot.gameStateByString(bot.currGameString));
                bot.currGameString = winString;
                bot.updateGameStateByString.bind(bot)()
                bot.updateShapesDrawStateByArray.bind(bot)();
                // bot.updateShapesByString.bind(bot)();
                // bot.printState();
                // console.log(`\nshapes: ${bot.globalGameState.shapes}`)
                setTimeout(bot.drawShapes.bind(bot), 1000);
                // bot.drawShapes();
                if (soundOn) gameAudio.play();
            }
        }
    });
}

// document.getElementById("solve")!.addEventListener("click", () => {
    //     console.log(bot.win(bot.currGameString));
    // });
    
    // // console.log(`after: ${bot.currGameString}`)
    // let moves= bot.movesInOne("1110");
    // console.log(`\nmoves("1110"): ${moves}\n`)
    // for (let move of moves!) {
    //     console.log(`move is: ${move} and it gets: ${bot.memoizedAlpha(move)}`)
    // }
    // console.log(`\nwin("1110"): ${bot.win("1110")}\n`)
    // // bot.printState();