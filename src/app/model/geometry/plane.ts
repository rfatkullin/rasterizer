import { Point3f } from "./point3f";

export class Plane {
    public constructor(private _n: Point3f, private _d: number) { }
}