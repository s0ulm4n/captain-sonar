/**
 * Point on a 2D grid.
 */
export class Point {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    equals(other: Point) {
        return this.x === other.x && this.y === other.y;
    }
};

/**
 * Message in the global chat.
 */
export type ChatMessage = {
    from: string,
    message: string,
};
