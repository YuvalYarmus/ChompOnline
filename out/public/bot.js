import { Game } from "./Game";
class Bot extends Game {
    constructor(n = -1, m = -1) {
        super(n, m);
        this.alphabeta = this.memoize((gameState) => {
            if (this.isGameOver(gameState))
                return true;
            let bool = false;
            for (let move of Object.values(this.one_move_boards(gameState)))
                if (!this.alphabeta(move))
                    bool = true;
            return bool;
        });
    }
    createNewGameState(n, m) {
        let arr = [];
        for (let i = 0; i < n; i++) {
            arr.push([]);
            for (let j = 0; j < m; j++) {
                arr[i].push(true);
            }
        }
        return arr;
    }
    copyGameStateArray(gameState = null) {
        let arr = [];
        if (gameState === null)
            gameState = super.globalGameState.array;
        for (let i = 0; i < gameState.length; i++) {
            const element = gameState[i];
            arr.push([]);
            for (let j = 0; j < gameState[i].length; j++) {
                arr[i].push(gameState[i][j]);
            }
        }
        return arr;
    }
    isGameOver(gameState) {
        if (gameState === (null || undefined))
            return undefined;
        gameState.forEach(element => {
            element.forEach(circle => {
                if (circle === true)
                    return false;
            });
        });
        return false;
    }
    gameStateToString(gameState) {
        let string = "";
        for (let i = 0; i < gameState.length; i++) {
            if (i != 0)
                string += "-";
            for (let j = 0; j < gameState[i].length; j++) {
                string += gameState[i][j].toString();
            }
        }
        return string;
    }
    memoize(func) {
        let cache = {};
        const memoized = (args) => {
            let key1 = this.gameStateToString(args);
            if (cache[key1] != undefined)
                return cache[key1];
            let result = func(args);
            cache[key1] = result;
            return result;
        };
        return memoized;
    }
    solve(gameState) {
        if (gameState === (null || undefined) || this.isGameOver(gameState))
            return null;
        for (let move of Object.values(this.one_move_boards(gameState))) {
            let has_a_win = this.alphabeta(move);
            if (has_a_win === false)
                return move;
        }
    }
    one_move_boards(gameState) {
        let boards = {};
        for (let i = 0; i < gameState.length; i++) {
            for (let j = 0; j < gameState[i].length; j++) {
                boards[`${i},${j}`] = this.compute_board(gameState, i, j);
            }
        }
        return boards;
    }
    compute_board(gameState, i, j) {
        let copy = this.copyGameStateArray(gameState);
        for (let i = 0; i <= i; i++) {
            let curr_row = copy[i];
            for (let j = curr_row.length - 1; j >= j; j--) {
                curr_row[j] = false;
            }
        }
        return copy;
    }
}
let bot = new Bot(6, 6);
document.getElementById("solve").addEventListener("click", () => {
    console.log(bot.solve(bot.globalGameState.array));
});
