import { Camera } from "./camera";
import { FigureDescription } from "./figure_description";
import { FigureInstance } from "./figure_instance";

export class SceneDescription {
    public figures: FigureDescription[];

    public instances: FigureInstance[];

    public camera: Camera;

    public static parseFrom(sceneJson: string): SceneDescription {
        return JSON.parse(sceneJson) as SceneDescription;
    }
}