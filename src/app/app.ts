
import { Point2D } from "./model/geometry/point2d";
import { Color } from "./model/materials/color";

export class App {
    private readonly CANVAS_WIDTH: number = 800;
    private readonly CANVAS_HEIGHT: number = 600;
    private readonly BLACK_COLOR: Color = { r: 0, g: 0, b: 0, a: 255 };

    private _pixelData: ImageData = null;
    private _canvas: HTMLCanvasElement = null;
    private _context: CanvasRenderingContext2D = null;
    private _drawPoints: Point2D[] = [];

    public init(): void {
        this._canvas = document.getElementById("rastCanvas") as HTMLCanvasElement;

        this._context = this._canvas.getContext("2d");

        this._pixelData = this._context.getImageData(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);

        this.addHandlers();

        this.drawInit();
    }

    private addHandlers(): void {
        this.onMouseDownHandler = this.onMouseDownHandler.bind(this);
        this.onKeyDownHandler = this.onKeyDownHandler.bind(this);

        this._canvas.addEventListener("mousedown", this.onMouseDownHandler, false);

        document.addEventListener("keydown", this.onKeyDownHandler, false);
    }

    private onMouseDownHandler(mouseEvent: MouseEvent) {
        const pointOnCanvas = {
            x: mouseEvent.clientX - this._canvas.offsetLeft,
            y: mouseEvent.clientY - this._canvas.offsetTop
        }

        this.addDrawPoint(pointOnCanvas);
    }

    private addDrawPoint(newPoint: Point2D): void {
        this._drawPoints.push(newPoint);

        if (this._drawPoints.length > 3) {
            this._drawPoints.shift()
        }

        this.drawPoint(newPoint.x, newPoint.y, this.BLACK_COLOR);
        this.drawPoint(newPoint.x - 1, newPoint.y, this.BLACK_COLOR);
        this.drawPoint(newPoint.x + 1, newPoint.y, this.BLACK_COLOR);
        this.drawPoint(newPoint.x, newPoint.y - 1, this.BLACK_COLOR);
        this.drawPoint(newPoint.x, newPoint.y + 1, this.BLACK_COLOR);

        this._context.putImageData(this._pixelData, 0, 0);
    }

    private onKeyDownHandler(keyboardEvent: KeyboardEvent): void {
        if (keyboardEvent.code === "Space") {
            this.draw();
        }
    }

    private drawInit(): void {
        this.fillBackground();

        this._context.putImageData(this._pixelData, 0, 0);
    }

    private draw(): void {
        this.fillBackground();

        this.drawPrimitives();

        this._context.putImageData(this._pixelData, 0, 0);
    }

    private drawPrimitives(): void {
        if (this._drawPoints.length < 2) {
            return;
        }

        if (this._drawPoints.length == 2) {
            this.drawLine(this._drawPoints[0], this._drawPoints[1]);
        } else {
            this.drawFilledTriangle(this._drawPoints[0], this._drawPoints[1], this._drawPoints[2]);
            this.drawLine(this._drawPoints[0], this._drawPoints[1]);
            this.drawLine(this._drawPoints[1], this._drawPoints[2]);
            this.drawLine(this._drawPoints[2], this._drawPoints[0]);
        }

        this._drawPoints = [];
    }

    private drawRandomLineWithNativeFunc(): void {
        const p0 = this.getRandomPoint();
        const p1 = this.getRandomPoint();

        this._context.moveTo(p0.x, p0.y);
        this._context.lineTo(p1.x, p1.y);
        this._context.stroke();
    }

    private drawLine(p0: Point2D, p1: Point2D): void {
        if (p0.x === p1.x) {
            return;
        }

        if (Math.abs(p0.x - p1.x) > Math.abs(p0.y - p1.y)) {
            if (p0.x > p1.x) {
                [p1, p0] = [p0, p1];
            }

            const step = (p1.y - p0.y) / (p1.x - p0.x);

            const d = this.getIterated(p0.x, p1.x, p0.y, step);
            for (let i = 0; i < (p1.x - p0.x); ++i) {
                this.drawPoint(p0.x + i, d[i], this.BLACK_COLOR);
            }
        } else {
            if (p0.y > p1.y) {
                [p1, p0] = [p0, p1];
            }

            const step = (p1.x - p0.x) / (p1.y - p0.y);

            const d = this.getIterated(p0.y, p1.y, p0.x, step);
            for (let i = 0; i < (p1.y - p0.y); ++i) {
                this.drawPoint(d[i], p0.y + i, this.BLACK_COLOR);
            }
        }
    }

    private drawFilledTriangle(p0: Point2D, p1: Point2D, p2: Point2D): void {
        if (p0.y > p1.y) {
            [p1, p0] = [p0, p1]
        }
        if (p1.y > p2.y) {
            [p2, p1] = [p1, p2]
        }
        if (p0.y > p1.y) {
            [p1, p0] = [p0, p1]
        }

        const p0p1: number[] = this.getIterated(p0.y, p1.y, p0.x, (p1.x - p0.x) / (p1.y - p0.y));
        const p1p2: number[] = this.getIterated(p1.y, p2.y, p1.x, (p2.x - p1.x) / (p2.y - p1.y));
        const p0p2: number[] = this.getIterated(p0.y, p2.y, p0.x, (p2.x - p0.x) / (p2.y - p0.y));

        p0p1.pop();

        let leftX: number[] = [...p0p1, ...p1p2];
        let rightX: number[] = p0p2;

        const color0: Color = this.getRandomColor();
        const color1: Color = this.getRandomColor();
        const color2: Color = this.getRandomColor();

        let c0p1: Color[] = this.getIteratedColor(p0.y, p1.y, color0, color1);
        let c1p2: Color[] = this.getIteratedColor(p1.y, p2.y, color1, color2);
        let c0p2: Color[] = this.getIteratedColor(p0.y, p2.y, color0, color2);

        c0p1.pop();

        let leftColors = [...c0p1, ...c1p2];
        let rightColors = c0p2;

        const middleIndex = Math.floor(leftX.length / 2);
        if (leftX[middleIndex] > rightX[middleIndex]) {
            [leftX, rightX] = [rightX, leftX];
            [leftColors, rightColors] = [rightColors, leftColors];
        }

        for (let i = 0; i <= (p2.y - p0.y); ++i) {
            const left = Math.floor(leftX[i]);
            const right = Math.floor(rightX[i]);
            const rowColors = this.getIteratedColor(left, right, leftColors[i], rightColors[i]);
            for (let j = left; j <= right; ++j) {
                const index = j - left;
                this.drawPoint(j, p0.y + i, rowColors[index]);
            }
        }
    }

    private getRandomColor(): Color {
        return {
            r: Math.random() * 255,
            g: Math.random() * 255,
            b: Math.random() * 255,
            a: 255
        }
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

    private getRandomPoint(): Point2D {
        return {
            x: Math.floor(Math.random() * this.CANVAS_WIDTH),
            y: Math.floor(Math.random() * this.CANVAS_HEIGHT)
        };
    }

    private fillBackground(): void {
        const data = this._pixelData.data;

        for (let x = 0; x < this.CANVAS_WIDTH; ++x) {
            for (let y = 0; y < this.CANVAS_HEIGHT; ++y) {

                let off = (y * this.CANVAS_WIDTH + x) * 4;

                data[off] = 255;
                data[off + 1] = 255;
                data[off + 2] = 255;
                data[off + 3] = 255;
            }
        }
    }

    private drawPoint(x: number, y: number, color: Color): void {
        const data = this._pixelData.data;

        x = Math.floor(x);
        y = Math.floor(y);

        let off = (y * this.CANVAS_WIDTH + x) * 4;

        data[off] = color.r;
        data[off + 1] = color.g;
        data[off + 2] = color.b;
        data[off + 3] = 255;
    }
}

const app = new App();
app.init();

