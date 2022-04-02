export class Color {
    public r: number;
    public g: number;
    public b: number;
    public a: number;

    constructor(newR: number, newG: number, newB: number);
    constructor(newR: number, newG: number, newB: number, newA: number = 255) {
        this.r = newR;
        this.g = newG;
        this.b = newB;
        this.a = newA;
    }
}