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

    public getSegmentIntersection(point1: Point3f, point2: Point3f): { point: Point3f, t: number } | null {
        const p1_p2 = point2.sub(point1);

        const delimeter = this.normal.dotProduct(p1_p2);
        if (Math.abs(delimeter) < Number.EPSILON) {
            return null;
        }

        const t = -(this.normal.dotProduct(point1) + this.distance) / delimeter;
        const point = point1.add(p1_p2.multiplyScalar(t));

        return { point, t };
    }
}