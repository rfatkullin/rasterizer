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
}