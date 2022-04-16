import { CanvasSettings } from "../configuration/canvas_settings";
import { PlatformPresets } from "../configuration/platform_presets";
import { IFilter } from "./ifilter";

export class SimpleAntialiasing implements IFilter {
    public constructor(private _canvasSettings: CanvasSettings) { }

    public apply(sourcePixels: Uint8ClampedArray): void {
        const pixelsCopy: Uint8ClampedArray = sourcePixels.copyWithin(0, 0);
        const componentsNumber: number = PlatformPresets.PixelsDataComponentsNumber;

        for (let currentPixelIndex = 0; currentPixelIndex < pixelsCopy.length; currentPixelIndex += componentsNumber) {
            let red: number = 0;
            let green: number = 0;
            let blue: number = 0;

            let neighborIndices: number[] = [
                currentPixelIndex,
                currentPixelIndex - componentsNumber * this._canvasSettings.Width,
                currentPixelIndex - componentsNumber * this._canvasSettings.Width - componentsNumber,
                currentPixelIndex - componentsNumber * this._canvasSettings.Width + componentsNumber,
                currentPixelIndex - componentsNumber,
                currentPixelIndex + componentsNumber,
                currentPixelIndex + componentsNumber * this._canvasSettings.Width,
                currentPixelIndex + componentsNumber * this._canvasSettings.Width - componentsNumber,
                currentPixelIndex + componentsNumber * this._canvasSettings.Width + componentsNumber
            ];

            neighborIndices = neighborIndices.filter(index => index >= 0 && index < pixelsCopy.length);

            for (let neighborIndex of neighborIndices) {
                red += pixelsCopy[neighborIndex];
                green += pixelsCopy[neighborIndex + 1];
                blue += pixelsCopy[neighborIndex + 2];
            }

            const samplesNumber: number = neighborIndices.length;
            sourcePixels[currentPixelIndex] = Math.round(red / samplesNumber);
            sourcePixels[currentPixelIndex + 1] = Math.round(green / samplesNumber);
            sourcePixels[currentPixelIndex + 2] = Math.round(blue / samplesNumber);
        }
    }
}