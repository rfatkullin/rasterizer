import { Point3f } from "../model/geometry/point3f";

export class Intersection {
    public constructor(
        public readonly inVertexIndex: number,
        public readonly outVertexIndex: number,
        public readonly intersectionPoint: Point3f,
        public readonly t: number
    ) { }
}