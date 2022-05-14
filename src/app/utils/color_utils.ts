import { Color } from "../model/materials/color";

export class ColorUtils {

    public static add(a: Color, b: Color): Color {
        return new Color(
            Math.min(a.r + b.r, 1.0),
            Math.min(a.g + b.g, 1.0),
            Math.min(a.b + b.b, 1.0)
        )
    }

    public static getColorByName(colorName: string): Color {
        switch (colorName) {
            case "red": {
                return Color.Red
            }
            case "blue": {
                return Color.Blue
            }
            case "green": {
                return Color.Green
            }
            case "purple": {
                return Color.Purple
            }
            case "yellow": {
                return Color.Yellow
            }
            case "cyan": {
                return Color.Cyan
            }
            case "black": {
                return Color.Black
            }
            default: {
                return Color.Black
            }
        }
    }

    public static interpolate(aColor: Color, bColor: Color, t: number): Color {
        const colorVector: Color = new Color(bColor.r - aColor.r, bColor.g - aColor.g, bColor.b - aColor.b);
        
        return new Color(aColor.r + t * colorVector.r, aColor.g + t * colorVector.g, aColor.b + t * colorVector.b)
    }

    public static generateRandomColorNames(colorsNumber: number): string[] {
        const result: string[] = [];

        for(let i = 0; i < colorsNumber; i++) {
            result.push(this.getRandomColorName());
        }

        return result;
    }

    public static getRandomColorName(): string {
        const colorIndex: number = Math.floor(Math.random() * 7);

        switch (colorIndex) {
            case 0: {
                return "red"
            }
            case 1: {
                return "blue"
            }
            case 2: {
                return "green"
            }
            case 3: {
                return "purple"
            }
            case 4: {
                return "yellow"
            }
            case 5: {
                return "cyan"
            }
            case 6: {
                return "black"
            }
            default: {
                return "black"
            }
        }
    }
}