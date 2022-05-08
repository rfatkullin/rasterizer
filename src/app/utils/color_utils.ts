import { Color } from "../model/materials/color";

export class ColorUtils {

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