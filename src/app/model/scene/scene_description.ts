import { Camera } from "./camera";
import { FigureDescription } from "./figure_description";
import { FigureInstance } from "./figure_instance";

export class SceneDescription {
    public constructor(
        public readonly figures: FigureDescription[],
        public readonly instances: FigureInstance[],
        public readonly camera: Camera) { }
}