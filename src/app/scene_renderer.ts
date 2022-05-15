import { Clipper } from "./clipping/clipper";
import { CanvasSettings } from "./configuration/canvas_settings";
import { RendererSettings } from "./configuration/renderer_settings";
import { IRenderer } from "./contracts/irenderer";
import { LightCalculator } from "./light_calculator";
import { VectorMath } from "./math/vector_math";
import { Point3f } from "./model/geometry/point3f";
import { Color } from "./model/materials/color";
import { FigureDescription } from "./model/scene/figure_description";
import { FigureInstance } from "./model/scene/figure_instance";
import { SceneDescription } from "./model/scene/scene_description";
import { TriangleDescription } from "./model/scene/triangle_description";
import { ViewFrustum } from "./model/scene/view_frustum";
import { TransformedTriangleDescription } from "./model/transformed_triangle_description";
import { Rasterizer } from "./rasterizer";
import { TransformFactory } from "./transforms/transforms_factory";

export class SceneRenderer implements IRenderer {
    private readonly _lightCalculator: LightCalculator;

    public constructor(
        private readonly _scene: SceneDescription,
        private readonly _clipper: Clipper,
        private readonly _rasterizer: Rasterizer,
        private readonly _canvasSettings: CanvasSettings) {

        this._lightCalculator = new LightCalculator(_scene.lighting, _scene.camera);
    }

    public start(): void {
        this.drawSceneFigures();
    }

    public drawSceneFigures(): void {
        this._rasterizer.clear();

        for (const instance of this._scene.instances) {
            const figureForInstance: FigureDescription = this._scene.figures
                .find(figure => figure.name === instance.name);

            const modelViewMatrix = this.getModelViewMatrix(instance);
            const transformedVertices = this.applyTransforms(figureForInstance.vertices, modelViewMatrix);

            const normalsModelViewMatrix = VectorMath.transpose(VectorMath.inverse3by3Matrix(VectorMath.getSubMatrix(modelViewMatrix, 3, 3)));
            let transformedTriangles: TransformedTriangleDescription[] = this.applyNormalsTransforms(normalsModelViewMatrix, figureForInstance.triangles);

            transformedTriangles = this._clipper.clip(transformedVertices, transformedTriangles);
            if (transformedTriangles.length === 0) {
                continue;
            }

            const projectedVertices: Point3f[] = this.applyProjections(transformedVertices);
            this.renderTriangles(projectedVertices, transformedVertices, transformedTriangles);
        }

        this._rasterizer.flush();
    }

    private renderTriangles(projectedVertices: Point3f[], onlyTransformedVertices: Point3f[], triangles: TransformedTriangleDescription[]): void {
        for (const triangle of triangles) {
            if (!RendererSettings.OnlyWired) {
                this.drawFilledTriangle(projectedVertices, onlyTransformedVertices, triangle);
            }

            this.drawWiredTriangle(projectedVertices, onlyTransformedVertices, triangle);
        }
    }

    private drawWiredTriangle(vertices: Point3f[], onlyTransformedVertices: Point3f[], triangle: TransformedTriangleDescription): void {
        const p0: Point3f = vertices[triangle.indices[0]];
        const p1: Point3f = vertices[triangle.indices[1]];
        const p2: Point3f = vertices[triangle.indices[2]];

        const color0: Color = this.getVertexColor(onlyTransformedVertices[triangle.indices[0]], triangle.normals[0], triangle.colors[0]);
        const color1: Color = this.getVertexColor(onlyTransformedVertices[triangle.indices[1]], triangle.normals[1], triangle.colors[1]);
        const color2: Color = this.getVertexColor(onlyTransformedVertices[triangle.indices[2]], triangle.normals[2], triangle.colors[2]);

        this._rasterizer.drawLine(p0, p1, color0, color1);
        this._rasterizer.drawLine(p1, p2, color1, color2);
        this._rasterizer.drawLine(p2, p0, color2, color0);
    }

    private drawFilledTriangle(vertices: Point3f[], onlyTransformedVertices: Point3f[], triangle: TransformedTriangleDescription): void {
        const p0: Point3f = vertices[triangle.indices[0]];
        const p1: Point3f = vertices[triangle.indices[1]];
        const p2: Point3f = vertices[triangle.indices[2]];

        const color0: Color = this.getVertexColor(onlyTransformedVertices[triangle.indices[0]], triangle.normals[0], triangle.colors[0]);
        const color1: Color = this.getVertexColor(onlyTransformedVertices[triangle.indices[1]], triangle.normals[1], triangle.colors[1]);
        const color2: Color = this.getVertexColor(onlyTransformedVertices[triangle.indices[2]], triangle.normals[2], triangle.colors[2]);

        this._rasterizer.drawFilledTriangle(p0, p1, p2, color0, color1, color2);
    }

    private getVertexColor(vertex: Point3f, normal: Point3f, color: Color): Color {
        return this._lightCalculator.calculateColor(vertex, normal, color);
    }

    private getModelViewMatrix(instance: FigureInstance): number[][] {
        const scale = TransformFactory.getScaleMatrix(instance.scale);
        const rotation = TransformFactory.getRotationMatrix(instance.rotation);
        const translate = TransformFactory.getTranslationMatrix(instance.translate);

        return VectorMath.multMatrix(translate, VectorMath.multMatrix(rotation, scale));
    }

    private applyNormalsTransforms(normalsModelViewMatrix: number[][], triangles: TriangleDescription[]): TransformedTriangleDescription[] {
        const result: TransformedTriangleDescription[] = [];

        for (let triangle of triangles) {
            const transformedTrianleNormals = triangle.normals
                .map(normal => {
                    const transformed = VectorMath.mult(normalsModelViewMatrix, normal);
                    const normalized = new Point3f(transformed[0], transformed[1], transformed[2]).getNormalized();
                    return normalized;
                });

            result.push(new TransformedTriangleDescription(triangle.indices, triangle.colors, transformedTrianleNormals));
        }

        return result;
    }

    private applyTransforms(vertices: number[][], modelViewTransform: number[][]): Point3f[] {
        const transformedVertices: Point3f[] = vertices.map(vertex => {
            let newVertex: number[] = VectorMath.mult(modelViewTransform, vertex);

            return new Point3f(newVertex[0], newVertex[1], newVertex[2]);
        });

        return transformedVertices;
    }

    private applyProjections(vertices: Point3f[]): Point3f[] {
        const afterProjection: Point3f[] = this.applyProjection(vertices);
        const afterCanvasProjection: Point3f[] = this.applyCanvasProjection(afterProjection);

        return this.applyCanvasCenteringAndYAxisInverse(afterCanvasProjection);
    }

    private applyProjection(vertices: Point3f[]): Point3f[] {
        return vertices.map(vertex =>
            new Point3f(
                vertex.x * this._scene.camera.frustum.near / vertex.z,
                vertex.y * this._scene.camera.frustum.near / vertex.z,
                1 / vertex.z));

    }

    private applyCanvasCenteringAndYAxisInverse(vertices: Point3f[]): Point3f[] {
        const xOffset = this._canvasSettings.width / 2;
        const yOffset = this._canvasSettings.height / 2;

        return vertices.map(vertex => new Point3f(Math.max(vertex.x + xOffset - 1, 0.0), Math.max(yOffset - vertex.y - 1), vertex.z));
    }

    private applyCanvasProjection(vertices: Point3f[]): Point3f[] {
        const frustum: ViewFrustum = this._scene.camera.frustum;

        const xFactor: number = this._canvasSettings.width / frustum.nearPlaneWidth;
        const yFactor: number = this._canvasSettings.height / frustum.nearPlaneHeight;

        return vertices.map(vertex =>
            new Point3f(
                vertex.x * xFactor,
                vertex.y * yFactor,
                vertex.z));
    }
}