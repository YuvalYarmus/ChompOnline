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
        for(let index = j; index < gameString.length; index++) {
            // height below the action:            
            if (parseInt(gameString[index]) < i) {
                string += gameString[index];
            } 
            // same or above the action height (action height - i can not be 0)
            else {
                string += (i -1).toString();
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
        if (gameString === (null || undefined || "0")) return false;
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
            if (cache[gameString] != undefined && cache[gameString] != null)
                return cache[gameString];
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
        if (gameString === null || gameString === undefined) return undefined;
        else if (gameString === "0") {
            alert("Well played! You won!");
            return "";
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
    }
    alphabeta(gameString: string) : boolean | undefined {
        if(gameString === null || gameString === undefined) return undefined;
        else if(gameString === "") return true;
        if (typeof gameString != "string") console.log(`gameString isnt string: ${gameString}`);
        if(this.memoizedSquare(gameString)) return true;
        let moves = this.movesInOne(gameString);
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
    }

    updateGameStateByString() {
        let a = this.globalGameState.array;
        for (let index = 0; index < a.length; index++) {
            for (let j = 0; j < a[index].length; j++) {
                if (j >= this.currGameString.length) {
                    this.globalGameState.array[index][j] = false;
                }
                else  {
                    if (this.n - index - 1 > parseInt(this.currGameString[j]) ) this.globalGameState.array[index][j] = false;
                }
            }
        }
    }
    updateShapesByString() {
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
        let circlePos : number[] = bot.clickFunc(e);
        if (circlePos[0] != -1) {
            if (soundOn) gameAudio.play();
            bot.updateGameString(bot.n - circlePos[0] - 1, circlePos[1]!);
            console.log(`game string: ${bot.currGameString}`);
            let winString : string | undefined = bot.win(bot.currGameString);
            if (winString === undefined) {
                console.log(`probably had a problem with gameString - ${bot.currGameString}, win is undefined`);
                throw new Error(`probably had a problem with gameString - ${bot.currGameString}, win is undefined`);
            } 
            else {
                console.log(`winString is:  ${winString}`);
                bot.currGameString = winString;
                bot.updateGameStateByString.bind(bot)()
                bot.updateShapesDrawStateByArray.bind(bot)();
                setTimeout(bot.drawShapes.bind(bot), 1000);
                if (soundOn) gameAudio.play();
            }
        }
    });
}
