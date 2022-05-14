import { Color } from "../materials/color";
import { DirectLight } from "./direct_light";

export class Lighting {
    public constructor(
        public readonly ambient: Color,
        public readonly directs: DirectLight[]) { }
}