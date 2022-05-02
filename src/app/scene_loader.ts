import { SceneDescription } from "./model/scene/scene_description";
import sceneData from '../data/scenes_data.json';
import { Camera } from "./model/scene/camera";
import { Point3f } from "./model/geometry/point3f";
import { FigureInstance } from "./model/scene/figure_instance";

export class SceneLoader {
    public static loadScene(): SceneDescription {
        const camera: Camera = new Camera(this.getPoint3f(sceneData.camera.position), { ...sceneData.camera.frustum });
        const instances: FigureInstance[] = sceneData.instances.map(instanceDescription => new FigureInstance(
            instanceDescription.name,
            this.getPoint3f(instanceDescription.scale),
            this.getPoint3f(instanceDescription.rotation),
            this.getPoint3f(instanceDescription.translate)));


        return new SceneDescription(sceneData.figures, instances, camera);
    }

    private static getPoint3f(cameraPosition: { x: number, y: number, z: number }): Point3f {
        return new Point3f(cameraPosition.x, cameraPosition.y, cameraPosition.z);

    }
}