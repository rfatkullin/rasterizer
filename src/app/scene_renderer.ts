import { CanvasSettings } from "./configuration/canvas_settings";
import { IRenderer } from "./contracts/IRenderer";
import { Demos } from "./data/demo_scenes";
import { VectorMath } from "./math/vector_math";
import { Point3f } from "./model/geometry/point3f";
import { Color } from "./model/materials/color";
import { FigureDescription } from "./model/scene/figure_description";
import { FigureInstance } from "./model/scene/figure_instance";
import { SceneDescription } from "./model/scene/scene_description";
import { TriangleDescription } from "./model/scene/triangle_description";
import { Rasterizer } from "./rasterizer";
import { TransformFactory } from "./transforms/transforms_factory";
import { ColorUtils } from "./utils/color_utils";

export class SceneRenderer implements IRenderer {

    public constructor(private _rasterizer: Rasterizer, private _canvasSettings: CanvasSettings) {
    }

    public start(): void {
        this.drawSceneFigures(Demos.Scene1);
    }

    public drawSceneFigures(scene: SceneDescription): void {
        this._rasterizer.clear();

        for (const instance of scene.instances) {
            const figureForInstance: FigureDescription = scene.figures
                .find(figure => figure.name === instance.name);

            const transformedVertices = this.applyTransforms(figureForInstance.vertices, instance);

            const projectedVertices: Point3f[] = this.applyProjections(transformedVertices,
                scene.camera.viewWindowPosition);

            for (const triangle of figureForInstance.triangles) {
                this.drawFilledTriangle(projectedVertices, triangle);
                this.drawWiredTriangle(projectedVertices, triangle);
            }
        }

        this._rasterizer.flush();
    }

    private drawWiredTriangle(vertices: Point3f[], triangle: TriangleDescription): void {
        const color: Color = ColorUtils.getColorByName(triangle.color);

        const p0: Point3f = vertices[triangle.indices[0]];
        const p1: Point3f = vertices[triangle.indices[1]];
        const p2: Point3f = vertices[triangle.indices[2]];

        this._rasterizer.drawLine(p0, p1, color);
        this._rasterizer.drawLine(p1, p2, color);
        this._rasterizer.drawLine(p2, p0, color);
    }

    private drawFilledTriangle(vertices: Point3f[], triangle: TriangleDescription): void {
        const color: Color = ColorUtils.getColorByName(triangle.color);

        const p0: Point3f = vertices[triangle.indices[0]];
        const p1: Point3f = vertices[triangle.indices[1]];
        const p2: Point3f = vertices[triangle.indices[2]];

        this._rasterizer.drawFilledTriangle(p0, p1, p2, color);
    }

    private applyTransforms(vertices: number[][], instance: FigureInstance): Point3f[] {
        const scale = TransformFactory.getScaleMatrix(instance.scale);
        const rotation = TransformFactory.getRotationMatrix(instance.rotation);
        const translate = TransformFactory.getTranslationMatrix(instance.translate);

        const transformedVertices: Point3f[] = vertices.map(vertex => {
            let newVertices: number[] = VectorMath.mult(scale, vertex);
            newVertices = VectorMath.mult(rotation, newVertices);
            newVertices = VectorMath.mult(translate, newVertices);

            return new Point3f(newVertices[0], newVertices[1], newVertices[2]);
        });

        return transformedVertices;
    }

    private applyProjections(vertices: Point3f[], viewWindowPosition: Point3f): Point3f[] {
        const afterProjection: Point3f[] = this.applyProjection(vertices, viewWindowPosition);
        const afterCanvasProjection: Point3f[] = this.applyCanvasProjection(afterProjection);

        return this.applyCanvasCenteringAndYAxisInverse(afterCanvasProjection);
    }

    private applyProjection(vertices: Point3f[], viewWindowPosition: Point3f): Point3f[] {
        return vertices.map(vertex =>
            new Point3f(
                vertex.x * viewWindowPosition.z / vertex.z,
                vertex.y * viewWindowPosition.z / vertex.z,
                1 / vertex.z));

    }

    private applyCanvasCenteringAndYAxisInverse(vertices: Point3f[]): Point3f[] {
        return vertices.map(vertex =>
            new Point3f(
                vertex.x + this._canvasSettings.Width / 2,
                this._canvasSettings.Height / 2 - vertex.y,
                vertex.z));
    }

    private applyCanvasProjection(vertices: Point3f[]): Point3f[] {
        const xKoeff: number = this._canvasSettings.Width / 10;
        const yKoeff: number = this._canvasSettings.Height / 8;

        return vertices.map(vertex =>
            new Point3f(
                vertex.x * xKoeff,
                vertex.y * yKoeff,
                vertex.z));
    }
}