import { SceneDescription } from "./model/scene/scene_description";
import sceneData from '../data/scenes_data.json';
import { Camera } from "./model/scene/camera";
import { Point3f } from "./model/geometry/point3f";
import { FigureInstance } from "./model/scene/figure_instance";
import { ViewFrustum } from "./model/scene/view_frustum";
import { TrigonometryUtils } from "./utils/trigonometry_utils";
import { SphereMeshGenerator } from "./generators/sphere_mesh_generator";
import { FigureDescription } from "./model/scene/figure_description";
import { TriangleDescription } from "./model/scene/triangle_description";
import { MeshDescription } from "./model/scene/raw/mesh_description";
import { Color } from "./model/materials/color";
import { ColorUtils } from "./utils/color_utils";
import { Lighting } from "./model/scene/lighting";
import { DirectLight } from "./model/scene/direct_light";

export class SceneLoader {
    public static loadScene(aspectRatio: number): SceneDescription {
        const frustum = this.getViewFrustum(aspectRatio, sceneData.camera.frustum);
        const camera: Camera = new Camera(this.getPoint3f(sceneData.camera.position), frustum);
        const lighting: Lighting = new Lighting(new Color(sceneData.lighting.ambient.r, sceneData.lighting.ambient.g, sceneData.lighting.ambient.b),
            sceneData.lighting.directs.map(light => new DirectLight(this.getPoint3f(light.direction), new Color(light.color.r, light.color.g, light.color.b))))
        const instances: FigureInstance[] = sceneData.instances.map(instanceDescription => new FigureInstance(
            instanceDescription.name,
            this.getPoint3f(instanceDescription.scale),
            this.getPoint3f(instanceDescription.rotation),
            this.getPoint3f(instanceDescription.translate)));

        sceneData.figures.push(SphereMeshGenerator.generateSphereMesh("sphere", "green"));

        return new SceneDescription(this.mapFigures(sceneData.figures), instances, camera, lighting);
    }

    private static mapFigures(meshes: MeshDescription[]): FigureDescription[] {
        const result: FigureDescription[] = [];

        for (let mesh of meshes) {
            const figureTriangles: TriangleDescription[] = [];
            for (let triangle of mesh.triangles) {
                const colors: Color[] = triangle.colors.map(color => ColorUtils.getColorByName(color));
                const triangleDescription = new TriangleDescription(triangle.indices, colors, triangle.normals);
                figureTriangles.push(triangleDescription);
            }
            result.push(new FigureDescription(mesh.name, mesh.vertices, figureTriangles));
        }

        return result;
    }

    private static getPoint3f(cameraPosition: { x: number, y: number, z: number }): Point3f {
        return new Point3f(cameraPosition.x, cameraPosition.y, cameraPosition.z);
    }

    private static getViewFrustum(aspectRatio: number, frustumDescription: { fovInDegrees: number, near: number, far: number }): ViewFrustum {
        const horizontalFov = TrigonometryUtils.toRadians(frustumDescription.fovInDegrees);
        const nearPlaneWidth: number = 2 * frustumDescription.near * Math.tan(horizontalFov / 2);
        const nearPlaneHeight: number = nearPlaneWidth / aspectRatio;
        const verticalFov = 2 * Math.atan(nearPlaneHeight / (2 * frustumDescription.near));

        return new ViewFrustum(horizontalFov, verticalFov, frustumDescription.near, frustumDescription.far, nearPlaneWidth, nearPlaneHeight);
    }
}