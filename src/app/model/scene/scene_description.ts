import { Camera } from "./camera";
import { FigureDescription } from "./figure_description";
import { FigureInstance } from "./figure_instance";
import { Lighting } from "./lighting";

export class SceneDescription {
    public constructor(
        public readonly figures: FigureDescription[],
        public readonly instances: FigureInstance[],
        public readonly camera: Camera,
        public readonly lighting: Lighting) { }
}