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

    public getSegmentIntersection(point1: Point3f, point2: Point3f): Point3f | null {
        const p2_p1 = point2.sub(point1);

        const delimeter = this.normal.dotProduct(p2_p1);
        if (Math.abs(delimeter) < Number.EPSILON) {
            return null;
        }

        const t = -(this.normal.dotProduct(point1) + this.distance) / delimeter;

        return point1.add(p2_p1.multiplyScalar(t));
    }
}