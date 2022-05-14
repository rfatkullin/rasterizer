export class Color {
    public static readonly Black: Color = { r: 0, g: 0, b: 0 };
    public static readonly Blue: Color = { r: 0, g: 0, b: 1.0 };
    public static readonly Green: Color = { r: 0, g: 1.0, b: 0 };
    public static readonly Red: Color = { r: 1.0, g: 0, b: 0 };
    public static readonly Yellow: Color = { r: 0.93, g: 0.83, b: 0.03 };
    public static readonly Purple: Color = { r: 0.72, g: 0.25, b: 1.0 };
    public static readonly Cyan: Color = { r: 0.074, g: 0.85, b: 0.91 };

    constructor(
        public readonly r: number,
        public readonly g: number,
        public readonly b: number) { }
}