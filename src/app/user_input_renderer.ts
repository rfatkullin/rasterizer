import { IRenderer } from "./contracts/IRenderer";
import { Point2f } from "./model/geometry/point2f";
import { Point3f } from "./model/geometry/point3f";
import { Color } from "./model/materials/color";
import { Rasterizer } from "./rasterizer";

export class UserInputRenderer implements IRenderer {
    private _canvas: HTMLCanvasElement = null;

    private _drawPoints: Point2f[] = [];
    private _rasterizer: Rasterizer = null;

    public constructor(newCanvas: HTMLCanvasElement, newRasterizer: Rasterizer) {
        this._canvas = newCanvas;
        this._rasterizer = newRasterizer;
    }

    public start(): void {
        this.addHandlers();
    }

    private addDrawPoint(newPoint: Point2f): void {
        this._drawPoints.push(newPoint);

        if (this._drawPoints.length > 3) {
            this._drawPoints.shift()
        }

        this._rasterizer.drawPoint(newPoint.x, newPoint.y, 1, Color.Black);
        this._rasterizer.drawPoint(newPoint.x - 1, newPoint.y, 1, Color.Black);
        this._rasterizer.drawPoint(newPoint.x + 1, newPoint.y, 1, Color.Black);
        this._rasterizer.drawPoint(newPoint.x, newPoint.y - 1, 1, Color.Black);
        this._rasterizer.drawPoint(newPoint.x, newPoint.y + 1, 1, Color.Black);

        this._rasterizer.flush();
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

    private drawPrimitives(): void {
        if (this._drawPoints.length < 2) {
            return;
        }

        const points: Point2f[] = this._drawPoints;
        this._drawPoints = [];

        // if (points.length == 2) {
        //     this._rasterizer.drawLine(points[0], points[1], Color.Black);

        //     return;
        // }

        // const p0: Point3f = points[0];
        // const p1: Point3f = points[1];
        // const p2: Point3f = points[2];

        // this._rasterizer.drawFilledTriangle(p0, p1, p2, Color.Black);
        // this._rasterizer.drawLine(p0, p1, Color.Black);
        // this._rasterizer.drawLine(p1, p2, Color.Black);
        // this._rasterizer.drawLine(p2, p0, Color.Black);
    }

    private onKeyDownHandler(keyboardEvent: KeyboardEvent): void {
        if (keyboardEvent.code === "Space") {
            this._rasterizer.clear();
            this.drawPrimitives();
            this._rasterizer.flush();
        }
    }
}