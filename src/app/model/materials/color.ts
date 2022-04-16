export class Color {
    public static readonly Black: Color = { r: 0, g: 0, b: 0 };
    public static readonly Blue: Color = { r: 0, g: 0, b: 255 };
    public static readonly Green: Color = { r: 0, g: 255, b: 0 };
    public static readonly Red: Color = { r: 255, g: 0, b: 0 };
    public static readonly Yellow: Color = { r: 237, g: 211, b: 8 };
    public static readonly Purple: Color = { r: 185, g: 65, b: 255 };
    public static readonly Cyan: Color = { r: 19, g: 218, b: 233 };

    public r: number;
    public g: number;
    public b: number;

    constructor(newR: number, newG: number, newB: number) {
        this.r = newR;
        this.g = newG;
        this.b = newB;
    }
}