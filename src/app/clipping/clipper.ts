import { VectorMath } from "../math/vector_math";
import { Plane } from "../model/geometry/plane";
import { Point3f } from "../model/geometry/point3f";
import { Color } from "../model/materials/color";
import { ViewFrustum } from "../model/scene/view_frustum";
import { TransformedTriangleDescription } from "../model/transformed_triangle_description";
import { ColorUtils } from "../utils/color_utils";
import { BoundingsFactory } from "./boundings_factory";
import { Intersection } from "./intersection";

export class Clipper {
    private readonly _planes: Plane[];

    public constructor(frustum: ViewFrustum) {
        this._planes = this.prepareClippingPlanes(frustum);
    }

    public clip(vertices: Point3f[], triangles: TransformedTriangleDescription[]): TransformedTriangleDescription[] {
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

    private clipTriangles(plane: Plane, vertices: Point3f[], triangles: TransformedTriangleDescription[]): TransformedTriangleDescription[] {
        const newTriangles: TransformedTriangleDescription[] = [];

        for (let triangle of triangles) {
            const clipResult = this.clipTriangleByPlane(plane, vertices, triangle);

            // Cut off the whole triangle
            if (clipResult === null) {
                continue;
            }

            // The triangle stays unchanged
            if (clipResult instanceof TransformedTriangleDescription) {
                newTriangles.push(triangle);
                continue;
            }

            const verticesLastIndex = vertices.length;
            vertices.push(clipResult[0].intersectionPoint)
            vertices.push(clipResult[1].intersectionPoint);

            // Only one vertex inside
            if (clipResult[1].inVertexIndex >= verticesLastIndex) {
                let color1 = this.getColorByVertexIndex(triangle, clipResult[0].inVertexIndex);
                let color2 = this.getInterpolatedColorByVertexIndices(triangle, clipResult[0].inVertexIndex, clipResult[0].outVertexIndex, clipResult[0].t);
                let color3 = this.getInterpolatedColorByVertexIndices(triangle, clipResult[0].inVertexIndex, clipResult[1].outVertexIndex, clipResult[1].t);

                let normal1 = this.getNormalByVertexIndex(triangle, clipResult[0].inVertexIndex);
                let normal2 = this.getInterpolatedNormalByVertexIndices(triangle, clipResult[0].inVertexIndex, clipResult[0].outVertexIndex, clipResult[0].t);
                let normal3 = this.getInterpolatedNormalByVertexIndices(triangle, clipResult[0].inVertexIndex, clipResult[1].outVertexIndex, clipResult[1].t);

                newTriangles.push(new TransformedTriangleDescription(
                    [clipResult[0].inVertexIndex, verticesLastIndex, verticesLastIndex + 1],
                    [color1, color2, color3],
                    [normal1, normal2, normal3]
                ));
            } else { // Two vertices inside
                let color1 = this.getColorByVertexIndex(triangle, clipResult[0].inVertexIndex);
                let color2 = this.getInterpolatedColorByVertexIndices(triangle, clipResult[0].inVertexIndex, clipResult[0].outVertexIndex, clipResult[0].t);
                let color3 = this.getColorByVertexIndex(triangle, clipResult[1].inVertexIndex);
                let color4 = this.getInterpolatedColorByVertexIndices(triangle, clipResult[1].inVertexIndex, clipResult[1].outVertexIndex, clipResult[1].t);

                let normal1 = this.getNormalByVertexIndex(triangle, clipResult[0].inVertexIndex);
                let normal2 = this.getInterpolatedNormalByVertexIndices(triangle, clipResult[0].inVertexIndex, clipResult[0].outVertexIndex, clipResult[0].t);
                let normal3 = this.getNormalByVertexIndex(triangle, clipResult[1].inVertexIndex);
                let normal4 = this.getInterpolatedNormalByVertexIndices(triangle, clipResult[1].inVertexIndex, clipResult[1].outVertexIndex, clipResult[1].t);

                newTriangles.push(new TransformedTriangleDescription(
                    [clipResult[0].inVertexIndex, verticesLastIndex, verticesLastIndex + 1],
                    [color1, color2, color4],
                    [normal1, normal2, normal4]
                ));

                newTriangles.push(new TransformedTriangleDescription(
                    [clipResult[0].inVertexIndex, verticesLastIndex + 1, clipResult[1].inVertexIndex],
                    [color1, color4, color3],
                    [normal1, normal4, normal3]
                ));
            }
        }

        return newTriangles;
    }

    private getColorByVertexIndex(triangle: TransformedTriangleDescription, vertexIndex: number): Color {
        return triangle.colors[triangle.indices.findIndex(index => index === vertexIndex)];
    }

    private getInterpolatedColorByVertexIndices(triangle: TransformedTriangleDescription, aVertexIndex: number, bVertexIndex: number, t: number): Color {
        const aColor = this.getColorByVertexIndex(triangle, aVertexIndex);
        const bColor = this.getColorByVertexIndex(triangle, bVertexIndex);

        return ColorUtils.interpolate(aColor, bColor, t);
    }

    private getNormalByVertexIndex(triangle: TransformedTriangleDescription, vertexIndex: number): Point3f {
        return triangle.normals[triangle.indices.findIndex(index => index === vertexIndex)];
    }

    private getInterpolatedNormalByVertexIndices(triangle: TransformedTriangleDescription, aVertexIndex: number, bVertexIndex: number, t: number): Point3f {
        const aNormal = this.getNormalByVertexIndex(triangle, aVertexIndex);
        const bNormal = this.getNormalByVertexIndex(triangle, bVertexIndex);

        return VectorMath.interpolateNormals(aNormal, bNormal, t);
    }

    private clipTriangleByPlane(plane: Plane, vertices: Point3f[], triangle: TransformedTriangleDescription): Intersection[] | TransformedTriangleDescription | null {
        const verticesFromFrontSide = triangle.indices.filter(index => plane.isInFront(vertices[index]));

        if (verticesFromFrontSide.length === 3) {
            return triangle;
        }
        if (verticesFromFrontSide.length === 0) {
            return null;
        }

        const verticesFromBackSide = triangle.indices.filter(index => verticesFromFrontSide.indexOf(index) < 0);

        if (verticesFromFrontSide.length === 1) {
            return this.getIntersectionsForSinglePointInFront(plane, vertices, verticesFromFrontSide, verticesFromBackSide);
        }
        
        return this.getIntersectionsForTwoPointsInFront(plane, vertices, verticesFromFrontSide, verticesFromBackSide);
    }

    private getIntersectionsForSinglePointInFront(plane: Plane, vertices: Point3f[], verticesFromFrontSide: number[], verticesFromBackSide: number[]): Intersection[] {
        const intersections: Intersection[] = [];

        const vertexInFront = vertices[verticesFromFrontSide[0]];
        const vertexInBack1 = vertices[verticesFromBackSide[0]];
        const vertexInBack2 = vertices[verticesFromBackSide[1]];

        let intersection = plane.getSegmentIntersection(vertexInFront, vertexInBack1);
        intersections.push(new Intersection(verticesFromFrontSide[0], verticesFromBackSide[0], intersection.point, intersection.t));

        intersection = plane.getSegmentIntersection(vertexInFront, vertexInBack2);
        intersections.push(new Intersection(verticesFromFrontSide[0], verticesFromBackSide[1], intersection.point, intersection.t));

        return intersections;
    }

    private getIntersectionsForTwoPointsInFront(plane: Plane, vertices: Point3f[], verticesFromFrontSide: number[], verticesFromBackSide: number[]): Intersection[] {
        const intersections: Intersection[] = [];

        const vertexInFront1 = vertices[verticesFromFrontSide[0]];
        const vertexInFront2 = vertices[verticesFromFrontSide[1]];
        const vertexInBack = vertices[verticesFromBackSide[0]];

        let intersection = plane.getSegmentIntersection(vertexInFront1, vertexInBack);
        intersections.push(new Intersection(verticesFromFrontSide[0], verticesFromBackSide[0], intersection.point, intersection.t));

        intersection = plane.getSegmentIntersection(vertexInFront2, vertexInBack);
        intersections.push(new Intersection(verticesFromFrontSide[1], verticesFromBackSide[0], intersection.point, intersection.t));

        return intersections;
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