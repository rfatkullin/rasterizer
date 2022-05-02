import { Clipper } from "./clipping/clipper";
import { CanvasSettings } from "./configuration/canvas_settings";
import { IRenderer } from "./contracts/irenderer";
import { IFilter } from "./filters/ifilter";
import { SimpleAntialiasing } from "./filters/simple_antialiasing";
import { SceneDescription } from "./model/scene/scene_description";
import { Rasterizer } from "./rasterizer";
import { SceneLoader } from "./scene_loader";
import { SceneRenderer } from "./scene_renderer";

export class App {
    private readonly _renderer: IRenderer;

    public constructor() {
        const canvas: HTMLCanvasElement = document.getElementById("rastCanvas") as HTMLCanvasElement;
        const context: CanvasRenderingContext2D = canvas.getContext("2d");
        const canvasSettings: CanvasSettings = new CanvasSettings(800, 600);
        const simpleAntialiasing: IFilter = new SimpleAntialiasing(canvasSettings);
        const rasterizer: Rasterizer = new Rasterizer(context, canvasSettings, [simpleAntialiasing]);
        const scene: SceneDescription = SceneLoader.loadScene();
        const clipper: Clipper = new Clipper(scene.camera.frustum);
        this._renderer = new SceneRenderer(scene, clipper, rasterizer, canvasSettings);
    }

    public start() {
        this._renderer.start();
    }
}

const app = new App();
app.start();