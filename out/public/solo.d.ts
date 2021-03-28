interface point {
    x: number;
    y: number;
    rectX: number;
    eveX: number;
    rectY: number;
    eveY: number;
}
declare class Shape {
    id: string;
    x: number;
    y: number;
    radius: number;
    i: number;
    j: number;
    shouldDraw: boolean;
    constructor(x: number, y: number, radius: number, i: number, j: number, shouldDraw?: boolean);
    toString(): string;
}
declare type boolState = boolean[][];
interface GameState {
    array: boolState;
    shapes: Shape[];
    [key: string]: any;
}
export default class Game {
    globalGameState: GameState;
    color: string;
    turns: number;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    constructor();
    /**
     * redrawing the board on every page resize
     */
    resizeFunc(): void;
    /**
     * responds to user moves
     * @param e - the mouse events the represent user moves
     */
    clickFunc(e: MouseEvent): void;
    /**
     * prompting the user to set the board size
     */
    promptGameState(): void;
    updateGameStateArray(gameStateArray: boolState): void;
    updateGameStateShapes(gameStateShapes: Shape[]): void;
    fitShapesToCanvas(canvas: HTMLCanvasElement, game_state: GameState): Shape[];
    /**
     * sets all values to true
     * should only run once in the beginning of each game
     * to change the shapes from true please use the updateShapesDrawStateByArray
     * @param currGameState
     */
    createShapesByArray(currGameState: boolState): void;
    updateShapesDrawStateByArray(): void;
    drawShapesByGameState(currGameState: GameState): void;
    drawShapes(shapes?: Shape[]): void;
    updateGameState(currGameState: boolState, circle: Shape): boolState;
    isIntersect(point: point, circle: Shape): boolean;
    getMousePos(e: MouseEvent): {
        x: number;
        y: number;
        rectX: number;
        eveX: number;
        rectY: number;
        eveY: number;
    };
}
export {};
