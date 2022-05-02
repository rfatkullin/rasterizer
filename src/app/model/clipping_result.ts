import { Point3f } from "./geometry/point3f";
import { TriangleDescription } from "./scene/triangle_description";

export class ClippingResult {
    public static readonly Truncated: number = 1;
    public static readonly Discarded: number = 2;
    public static readonly Accepted: number = 3;

    private constructor(public readonly status: number,
        public readonly newVertices: Point3f[],
        public readonly newTriangles: TriangleDescription[]) { }

    public static getTruncated(vertices: Point3f[], triangles: TriangleDescription[]): ClippingResult {
        return new ClippingResult(this.Truncated, vertices, triangles);
    }

    public static getDiscarded(): ClippingResult {
        return new ClippingResult(this.Discarded, [], []);
    }

    public static getAccepted(): ClippingResult {
        return new ClippingResult(this.Accepted, [], []);
    }
}