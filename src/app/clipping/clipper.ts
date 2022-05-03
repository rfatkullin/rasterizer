import { Plane } from "../model/geometry/plane";
import { Point3f } from "../model/geometry/point3f";
import { TriangleDescription } from "../model/scene/triangle_description";
import { ViewFrustum } from "../model/scene/view_frustum";
import { TrigonometryUtils } from "../utils/trigonometry_utils";
import { BoundingsFactory } from "./boundings_factory";

export class Clipper {
    private readonly _planes: Plane[];

    public constructor(frustum: ViewFrustum) {
        this._planes = this.prepareClippingPlanes(frustum);
    }

    public clip(vertices: Point3f[], triangles: TriangleDescription[]): TriangleDescription[] {
        const boundingSphere = BoundingsFactory.getBoundingSphere(vertices);

        for (let plane of this._planes) {
            const distanceToCenter = plane.distanceTo(boundingSphere.center);
            const doSphereIntersect = boundingSphere.radius > distanceToCenter + Number.EPSILON;

            if (doSphereIntersect) {
                triangles = this.clipTriangles(plane, vertices, triangles);
                continue;
            }

            if (!plane.isInFront(boundingSphere.center)) {
                return [];
            }
        }

        return triangles;
    }

    private clipTriangles(plane: Plane, vertices: Point3f[], triangles: TriangleDescription[]): TriangleDescription[] {
        const newTriangles: TriangleDescription[] = [];

        for (let triangle of triangles) {
            const result = this.clipTriangleByPlane(plane, vertices, triangle);

            if (result.remainingVertexIndices.length === 0) {
                continue;
            }

            if (result.remainingVertexIndices.length === 3) {
                newTriangles.push(triangle);
                continue;
            }

            const verticesLastIndex = vertices.length;
            vertices.push(result.newVertices[0]);
            vertices.push(result.newVertices[1]);

            newTriangles.push(new TriangleDescription(
                [result.remainingVertexIndices[0], verticesLastIndex, verticesLastIndex + 1],
                triangle.color
            ));

            if (result.remainingVertexIndices.length === 2) {
                newTriangles.push(new TriangleDescription(
                    [result.remainingVertexIndices[0], verticesLastIndex + 1, result.remainingVertexIndices[1]],
                    triangle.color
                ));
            }
        }

        return newTriangles;
    }

    private clipTriangleByPlane(plane: Plane, vertices: Point3f[], triangle: TriangleDescription): { remainingVertexIndices: number[], newVertices: Point3f[] } {
        const testResults: { isInFront: boolean, index: number }[] = triangle.indices.map(i => {
            return {
                isInFront: plane.isInFront(vertices[i]),
                index: i
            }
        });

        const verticesFromFrontSide = testResults.filter(element => element.isInFront)
            .map(element => element.index);

        if (verticesFromFrontSide.length === 3) {
            return { remainingVertexIndices: verticesFromFrontSide, newVertices: [] };
        }
        if (verticesFromFrontSide.length === 0) {
            return { remainingVertexIndices: [], newVertices: [] };
        }

        const verticesFromBackSide = testResults.filter(element => !element.isInFront)
            .map(element => element.index);

        const newVertices: Point3f[] = [];

        if (verticesFromBackSide.length === 1) {
            newVertices.push(plane.getSegmentIntersection(vertices[verticesFromFrontSide[0]], vertices[verticesFromBackSide[0]]));
            newVertices.push(plane.getSegmentIntersection(vertices[verticesFromFrontSide[1]], vertices[verticesFromBackSide[0]]));
        } else {
            newVertices.push(plane.getSegmentIntersection(vertices[verticesFromBackSide[0]], vertices[verticesFromFrontSide[0]]));
            newVertices.push(plane.getSegmentIntersection(vertices[verticesFromBackSide[1]], vertices[verticesFromFrontSide[0]]));
        }

        if (newVertices.findIndex(vertex => vertex === null) >= 0) {
            throw new Error("Can't find plane and segment intersection");
        }

        return { remainingVertexIndices: verticesFromFrontSide, newVertices };
    }

    private prepareClippingPlanes(frustum: ViewFrustum): Plane[] {
        const horizontalAngleSinValue: number = Math.sin(frustum.horizontalFov / 2);
        const horizontalAngleCosValue: number = Math.cos(frustum.horizontalFov / 2);

        const verticalAngleSinValue: number = Math.sin(frustum.verticalFov / 2);
        const verticalAngleCosValue: number = Math.cos(frustum.verticalFov / 2);

        return [
            // Near plane
            new Plane(new Point3f(0, 0, 1), -frustum.near),
            // Far plane
            new Plane(new Point3f(0, 0, -1), frustum.far),
            // Right plane
            new Plane(new Point3f(horizontalAngleCosValue, 0, horizontalAngleSinValue), 0),
            // Left plane
            new Plane(new Point3f(-horizontalAngleCosValue, 0, horizontalAngleSinValue), 0),
            // Top plane
            new Plane(new Point3f(0, verticalAngleSinValue, verticalAngleCosValue), 0),
            // Bottom plane
            new Plane(new Point3f(0, -verticalAngleSinValue, verticalAngleCosValue), 0),
        ]
    }

}