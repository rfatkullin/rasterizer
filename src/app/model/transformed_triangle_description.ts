import { Point3f } from "./geometry/point3f";
import { Color } from "./materials/color";

export class TransformedTriangleDescription {
    public constructor(
        public readonly indices: number[],
        public readonly colors: Color[],
        public readonly normals: Point3f[]) { }
}