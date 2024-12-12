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

    equals(other: Point): boolean {
        return this.equalsCoord(other.x, other.y);
    }

    equalsCoord(x: number, y: number): boolean {
        return this.x === x && this.y === y;
    }
};

/**
 * Message in the global chat.
 */
export type ChatMessage = {
    from: string,
    message: string,
};
