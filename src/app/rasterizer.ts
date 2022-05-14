import { CanvasSettings } from "./configuration/canvas_settings";
import { RasterizerSettings } from "./configuration/rasterizer_settings";
import { IFilter } from "./filters/ifilter";
import { Point3f } from "./model/geometry/point3f";
import { Color } from "./model/materials/color";

export class Rasterizer {
    private _pixelData: ImageData = null;
    private _depthBuffer: Map<number, number> = new Map<number, number>()

    constructor(private readonly _context: CanvasRenderingContext2D, 
        private readonly _canvasSettings: CanvasSettings, 
        private readonly _filters: IFilter[]) {

        if (!RasterizerSettings.UseFilters) {
            this._filters = [];
        }

        this._pixelData = this._context.getImageData(0, 0, this._canvasSettings.width, this._canvasSettings.height);

        this.clear();
    }

    public clear(): void {
        this.fillBackground();

        this._context.putImageData(this._pixelData, 0, 0);

        this._depthBuffer = new Map<number, number>();
    }

    public flush(): void {
        for (let filter of this._filters) {
            filter.apply(this._pixelData.data);
        }

        this._context.putImageData(this._pixelData, 0, 0);
    }

    public drawPoint(x: number, y: number, depth: number, color: Color): void {
        x = Math.floor(x);
        y = Math.floor(y);

        const bufferIndex = x * 10000 + y;
        if (this._depthBuffer.has(bufferIndex) && this._depthBuffer.get(bufferIndex) >= depth) {
            return;
        }

        this._depthBuffer.set(bufferIndex, depth);

        let off = (y * this._canvasSettings.width + x) * 4;

        const data = this._pixelData.data;

        data[off] = color.r * 255;
        data[off + 1] = color.g * 255;
        data[off + 2] = color.b * 255;
        data[off + 3] = 255;
    }

    public drawLine(p0: Point3f, p1: Point3f, color1: Color, color2: Color): void {
        if (p0.x === p1.x) {
            this.drawVerticalLine(p0, p1, color1, color2)
            return;
        }

        if (p0.y === p1.y) {
            this.drawHorizontalLine(p0, p1, color1, color2)
            return;
        }

        if (Math.abs(p0.x - p1.x) > Math.abs(p0.y - p1.y)) {
            this.drawLineByOx(p0, p1, color1, color2);
            return;
        }

        this.drawLineByOy(p0, p1, color1, color2);
    }

    private drawLineByOx(p0: Point3f, p1: Point3f, color1: Color, color2: Color) {
        if (p0.x > p1.x) {
            [p1, p0] = [p0, p1];
            [color1, color2] = [color2, color1];
        }

        const yDelta = (p1.y - p0.y) / (p1.x - p0.x);
        const yValues = this.getIterated(p0.x, p1.x, p0.y, yDelta);

        const zDelta = (p1.z - p0.z) / (p1.x - p0.x);
        const zValues = this.getIterated(p0.x, p1.x, p0.z, zDelta);

        const colors = this.getIteratedColor(p0.x, p1.x, color1, color2);

        for (let i = 0; i < (p1.x - p0.x); ++i) {
            this.drawPoint(p0.x + i, yValues[i], zValues[i], colors[i]);
        }
    }

    private drawLineByOy(p0: Point3f, p1: Point3f, color1: Color, color2: Color) {
        if (p0.y > p1.y) {
            [p1, p0] = [p0, p1];
            [color1, color2] = [color2, color1];
        }

        const xDelta = (p1.x - p0.x) / (p1.y - p0.y);
        const xValues = this.getIterated(p0.y, p1.y, p0.x, xDelta);

        const zDelta = (p1.z - p0.z) / (p1.y - p0.y);
        const zValues = this.getIterated(p0.y, p1.y, p0.z, zDelta);

        const colors = this.getIteratedColor(p0.y, p1.y, color1, color2);

        for (let i = 0; i < (p1.y - p0.y); ++i) {
            this.drawPoint(xValues[i], p0.y + i, zValues[i], colors[i]);
        }
    }

    private drawVerticalLine(p0: Point3f, p1: Point3f, color1: Color, color2: Color): void {
        if (p0.y > p1.y) {
            [p1, p0] = [p0, p1];
            [color1, color2] = [color2, color1];
        }

        const zDelta = (p1.z - p0.z) / (p1.y - p0.y);
        const zValues = this.getIterated(p0.y, p1.y, p0.z, zDelta);

        const colors = this.getIteratedColor(p0.y, p1.y, color1, color2);

        for (let i = 0; i < (p1.y - p0.y); ++i) {
            this.drawPoint(p0.x, p0.y + i, zValues[i], colors[i]);
        }
    }

    private drawHorizontalLine(p0: Point3f, p1: Point3f, color1: Color, color2: Color): void {
        if (p0.x > p1.x) {
            [p1, p0] = [p0, p1];
            [color1, color2] = [color2, color1];
        }

        const zDelta = (p1.z - p0.z) / (p1.x - p0.x);
        const zValues = this.getIterated(p0.x, p1.x, p0.z, zDelta);

        const colors = this.getIteratedColor(p0.x, p1.x, color1, color2);

        for (let i = 0; i < (p1.x - p0.x); ++i) {
            this.drawPoint(p0.x + i, p0.y, zValues[i], colors[i]);
        }
    }

    public drawFilledTriangle(p0: Point3f, p1: Point3f, p2: Point3f, color0: Color, color1: Color, color2: Color): void {
        p0 = new Point3f(Math.floor(p0.x), Math.floor(p0.y), p0.z);
        p1 = new Point3f(Math.floor(p1.x), Math.floor(p1.y), p1.z);
        p2 = new Point3f(Math.floor(p2.x), Math.floor(p2.y), p2.z);

        if (p0.y > p1.y) {
            [p1, p0] = [p0, p1];
            [color1, color0] = [color0, color1];
        }
        if (p1.y > p2.y) {
            [p2, p1] = [p1, p2];
            [color2, color1] = [color1, color2];
        }
        if (p0.y > p1.y) {
            [p1, p0] = [p0, p1];
            [color1, color0] = [color0, color1];
        }

        let { left: leftX, right: rightX } = this.getInterpolatedX(p0, p1, p2);
        let { left: leftZ, right: rightZ } = this.getInterpolatedZ(p0, p1, p2);
        let { left: leftColors, right: rightColors } = this.getInterpolatedColors(p0, p1, p2, color0, color1, color2);

        const middleIndex = Math.floor(leftX.length / 2);
        if (leftX[middleIndex] > rightX[middleIndex]) {
            [leftX, rightX] = [rightX, leftX];
            [leftZ, rightZ] = [rightZ, leftZ];
            [leftColors, rightColors] = [rightColors, leftColors];
        }

        for (let i = 0; i <= (p2.y - p0.y); ++i) {
            const left = Math.floor(leftX[i]);
            const right = Math.floor(rightX[i]);
            const rowColors = this.getIteratedColor(left, right, leftColors[i], rightColors[i]);
            const depths = this.getIterated(left, right, leftZ[i], (rightZ[i] - leftZ[i]) / (right - left))
            for (let j = left; j <= right; ++j) {
                const index = j - left;

                this.drawPoint(j, p0.y + i, depths[index], rowColors[index]);
            }
        }
    }

    private getInterpolatedX(p0: Point3f, p1: Point3f, p2: Point3f): { left: number[], right: number[] } {
        const p0p1: number[] = this.getIterated(p0.y, p1.y, p0.x, (p1.x - p0.x) / (p1.y - p0.y));
        const p1p2: number[] = this.getIterated(p1.y, p2.y, p1.x, (p2.x - p1.x) / (p2.y - p1.y));
        const p0p2: number[] = this.getIterated(p0.y, p2.y, p0.x, (p2.x - p0.x) / (p2.y - p0.y));

        p0p1.pop();

        let leftX: number[] = [...p0p1, ...p1p2];
        let rightX: number[] = p0p2;

        return { left: leftX, right: rightX };
    }

    private getInterpolatedZ(p0: Point3f, p1: Point3f, p2: Point3f): { left: number[], right: number[] } {
        const p0p1: number[] = this.getIterated(p0.y, p1.y, p0.z, (p1.z - p0.z) / (p1.y - p0.y));
        const p1p2: number[] = this.getIterated(p1.y, p2.y, p1.z, (p2.z - p1.z) / (p2.y - p1.y));
        const p0p2: number[] = this.getIterated(p0.y, p2.y, p0.z, (p2.z - p0.z) / (p2.y - p0.y));

        p0p1.pop();

        let leftZ: number[] = [...p0p1, ...p1p2];
        let rightZ: number[] = p0p2;

        return { left: leftZ, right: rightZ };
    }

    private getInterpolatedColors(p0: Point3f, p1: Point3f, p2: Point3f, color0: Color, color1: Color, color2: Color): { left: Color[], right: Color[] } {
        let c0p1: Color[] = this.getIteratedColor(p0.y, p1.y, color0, color1);
        let c1p2: Color[] = this.getIteratedColor(p1.y, p2.y, color1, color2);
        let c0p2: Color[] = this.getIteratedColor(p0.y, p2.y, color0, color2);

        c0p1.pop();

        let leftColors = [...c0p1, ...c1p2];
        let rightColors = c0p2;

        return { left: leftColors, right: rightColors };
    }

    private getIterated(iStart: number, iEnd: number, dStart: number, step: number): number[] {
        const d: number[] = [];
        let dCurrent = dStart;
        for (let i = iStart; i <= iEnd; ++i) {
            d.push(dCurrent);
            dCurrent = dCurrent + step;
        }

        return d;
    }

    private getIteratedColor(iStart: number, iEnd: number, startColor: Color, endColor: Color): Color[] {
        const colors = [];
        const steps = iEnd - iStart;
        const stepColor = {
            r: (endColor.r - startColor.r) / steps,
            g: (endColor.g - startColor.g) / steps,
            b: (endColor.b - startColor.b) / steps
        };

        let currentColor = { ...startColor };
        for (let i = iStart; i <= iEnd; ++i) {
            colors.push({ ...currentColor });
            currentColor.r += stepColor.r;
            currentColor.g += stepColor.g;
            currentColor.b += stepColor.b;
        }

        return colors;
    }

    private fillBackground(): void {
        const data = this._pixelData.data;

        for (let x = 0; x < this._canvasSettings.width; ++x) {
            for (let y = 0; y < this._canvasSettings.height; ++y) {

                let off = (y * this._canvasSettings.width + x) * 4;

                data[off] = 255;
                data[off + 1] = 255;
                data[off + 2] = 255;
                data[off + 3] = 255;
            }
        }
    }


}