import { Point3f } from "./point3f";

export class Plane {
    public constructor(public readonly normal: Point3f,
        public readonly distance: number) { }

    public isInFront(point: Point3f): boolean {
        return this.normal.dotProduct(point) + this.distance > Number.EPSILON;
    }

    public distanceTo(point: Point3f): number {
        return Math.abs(this.normal.dotProduct(point) + this.distance) / this.normal.length;
    }
}