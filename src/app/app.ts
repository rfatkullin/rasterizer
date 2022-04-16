import { CanvasSettings } from "./configuration/canvas_settings";
import { IRenderer } from "./contracts/IRenderer";
import { IFilter } from "./filters/ifilter";
import { SimpleAntialiasing } from "./filters/simple_antialiasing";
import { Rasterizer } from "./rasterizer";
import { SceneRenderer } from "./scene_renderer";

export class App {
    private readonly _renderer: IRenderer;

    public constructor() {
        const canvas: HTMLCanvasElement = document.getElementById("rastCanvas") as HTMLCanvasElement;
        const context: CanvasRenderingContext2D = canvas.getContext("2d");
        const canvasSettings: CanvasSettings = new CanvasSettings(800, 600);
        const simpleAntialiasing: IFilter = new SimpleAntialiasing(canvasSettings);
        const rasterizer: Rasterizer = new Rasterizer(context, canvasSettings, [simpleAntialiasing]);

        //this._renderer = new UserInputRenderer(canvas, rasterizer);
        this._renderer = new SceneRenderer(rasterizer, canvasSettings);
    }

    public start() {
        this._renderer.start();
    }
}

const app = new App();
app.start();