import { Point3f } from "./point3f";

export class Sphere {
    private readonly _radiusSquared: number;
    public constructor(
        public readonly center: Point3f,
        public readonly radius: number) {
        this._radiusSquared = radius * radius;
    }

    public static readonly Dummy = new Sphere(new Point3f(0, 0, 0), 0);

    public get isDummy(): boolean {
        return this.radius < Number.EPSILON;
    }

    public isIn(point: Point3f): boolean {
        const pointToCenter = this.center.sub(point);

        return pointToCenter.lengthSquared < this._radiusSquared + Number.EPSILON;
    }
}