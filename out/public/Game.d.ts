interface point {
    x: number;
    y: number;
    rectX: number;
    eveX: number;
    rectY: number;
    eveY: number;
}
export interface Shape {
    id: string;
    x: number;
    y: number;
    radius: number;
    i: number;
    j: number;
    shouldDraw: boolean;
}
export declare class Shape implements Shape {
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
export declare class Game {
    globalGameState: GameState;
    color: string;
    turns: number;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    constructor(n?: number, m?: number);
    /**
     * redrawing the board on every page resize
     */
    resizeFunc(): void;
    /**
     * responds to user moves
     * @param e - the mouse events the represent user moves
     */
    clickFunc(e: MouseEvent): number[];
    /**
     * prompting the user to set the board size
     */
    promptGameState(): void;
    updateGameStateArray(gameStateArray: boolState): void;
    resetGameStateArray(n?: number, m?: number): void;
    updateGameStateShapes(gameStateShapes: Shape[]): void;
    fitShapesToCanvas(canvas: HTMLCanvasElement, game_state: GameState): Shape[];
    /**
     * sets all values to true
     * should only run once in the beginning of each game
     * to change the shapes from true please use the updateShapesDrawStateByArray
     * @param currGameState
     */
    createShapesByArray(currGameState: boolState): void;
    updateShapesDrawStateByArray(game_state?: boolState): void;
    drawShapesByGameState(currGameState: GameState): void;
    drawShapes(shapes?: Shape[]): void;
    updateGameState(currGameState: boolState, circle: Shape): boolState;
    replaceGameStateArray(gameState: boolState | boolean[][]): void;
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
