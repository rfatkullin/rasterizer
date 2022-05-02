import { Point3f } from "../geometry/point3f";

export class FigureInstance {
    public constructor(
        public readonly name: string,
        public readonly scale: Point3f,
        public readonly rotation: Point3f,
        public readonly translate: Point3f) { }
}