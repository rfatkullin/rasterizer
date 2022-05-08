import { SceneDescription } from "./model/scene/scene_description";
import sceneData from '../data/scenes_data.json';
import { Camera } from "./model/scene/camera";
import { Point3f } from "./model/geometry/point3f";
import { FigureInstance } from "./model/scene/figure_instance";
import { ViewFrustum } from "./model/scene/view_frustum";
import { TrigonometryUtils } from "./utils/trigonometry_utils";
import { SphereMeshGenerator } from "./generators/sphere_mesh_generator";

export class SceneLoader {
    public static loadScene(aspectRatio: number): SceneDescription {
        const frustum = this.getViewFrustum(aspectRatio, sceneData.camera.frustum);
        const camera: Camera = new Camera(this.getPoint3f(sceneData.camera.position), frustum);
        const instances: FigureInstance[] = sceneData.instances.map(instanceDescription => new FigureInstance(
            instanceDescription.name,
            this.getPoint3f(instanceDescription.scale),
            this.getPoint3f(instanceDescription.rotation),
            this.getPoint3f(instanceDescription.translate)));

        const figures = sceneData.figures;
        figures.push(SphereMeshGenerator.generateSphereMesh("sphere"));

        return new SceneDescription(sceneData.figures, instances, camera);
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