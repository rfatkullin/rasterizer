import { ClippingResult } from "../model/clipping_result";
import { Plane } from "../model/geometry/plane";
import { Point3f } from "../model/geometry/point3f";
import { TriangleDescription } from "../model/scene/triangle_description";
import { ViewFrustum } from "../model/scene/view_frustum";
import { BoundingsFactory } from "./boundings_factory";

export class Clipper {
    private readonly _planes: Plane[];

    public constructor(frustum: ViewFrustum) {
        this._planes = this.prepareClippingPlanes(frustum.fovInDegrees, frustum.near, frustum.far);
    }

    public check(vertices: Point3f[], triangles: TriangleDescription[]): ClippingResult {
        const boundingSphere = BoundingsFactory.getBoundingSphere(vertices);

        for (let plane of this._planes) {
            const distanceToCenter = plane.distanceTo(boundingSphere.center);
            const doSphereIntersect = boundingSphere.radius + Number.EPSILON > distanceToCenter;

            if (doSphereIntersect) {
                return ClippingResult.getTruncated([], []);
            }

            if (!plane.isInFront(boundingSphere.center)) {
                return ClippingResult.getDiscarded();
            }
        }

        return ClippingResult.getAccepted();
    }

    private prepareClippingPlanes(fovInDegrees: number, nearDistance: number, farDistance: number): Plane[] {
        const fovHalfInRadians: number = fovInDegrees / 180 * Math.PI;

        const sinValue: number = Math.sin(fovHalfInRadians);
        const cosValue: number = Math.cos(fovHalfInRadians);

        return [
            // Near plane
            new Plane(new Point3f(0, 0, 1), nearDistance),
            // Far plane
            new Plane(new Point3f(0, 0, -1), farDistance),
            // Right plane
            new Plane(new Point3f(cosValue, 0, sinValue), 0),
            // Left plane
            new Plane(new Point3f(-cosValue, 0, sinValue), 0),
            // Top plane
            new Plane(new Point3f(0, sinValue, cosValue), 0),
            // Bottom plane
            new Plane(new Point3f(0, -sinValue, cosValue), 0),
        ]
    }

}