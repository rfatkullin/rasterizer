import { Point3f } from "../geometry/point3f";
import { Color } from "../materials/color";

export class DirectLight {
    public constructor(
        public readonly direction: Point3f,
        public readonly color: Color) { }
}