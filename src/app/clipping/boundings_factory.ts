import { Point3f } from "../model/geometry/point3f";
import { Sphere } from "../model/geometry/sphere";

export class BoundingsFactory {
    public static getBoundingSphere(points: Point3f[]): Sphere {
        return this.welzlForSphere([...points], []);
    }

    private static welzlForSphere(p: Point3f[], r: Point3f[]): Sphere {
        if (p.length == 0) {
            return this.getSphereWithTrivialAlgorithm(r);
        }

        const randomPointIndex: number = Math.floor(Math.random() * p.length);
        const excludedPoints = p.splice(randomPointIndex, 1);

        const sphereWithoutPointInBorder = this.welzlForSphere(p, r);
        if (sphereWithoutPointInBorder.isIn(excludedPoints[0])) {
            return sphereWithoutPointInBorder;
        }

        r.push(excludedPoints[0]);
        
        return this.welzlForSphere(p, r);
    }

    private static getSphereWithTrivialAlgorithm(points: Point3f[]): Sphere {
        if (points.length <= 1) {
            return Sphere.Dummy;
        }

        if (points.length <= 2) {
            return this.getSphereByTwoPoints(points[0], points[1]);
        }

        return this.getSphereByThreePoints(points[0], points[1], points[2]);
    }

    private static getSphereByTwoPoints(p1: Point3f, p2: Point3f): Sphere {
        const p1_p2 = p2.sub(p1);
        const radius = p1_p2.length / 2;
        const center = p1.add(p1_p2.multiplyScalar(0.5));

        return new Sphere(center, radius);
    }

    private static getSphereByThreePoints(p1: Point3f, p2: Point3f, p3: Point3f): Sphere {
        const p1_p2 = p2.sub(p1);
        const p1_p3 = p3.sub(p1);
        const p2_p1 = p1.sub(p2);
        const p2_p3 = p3.sub(p2);
        const p3_p1 = p1.sub(p3);
        const p3_p2 = p2.sub(p3);

        const triangleNormal = p1_p2.crossProduct(p2_p3);

        const delimeter = 1.0 / (2 * triangleNormal.lengthSquared);

        const alpha = p2_p3.lengthSquared * p1_p2.dotProduct(p1_p3) * delimeter;
        const beta = p1_p3.lengthSquared * p2_p1.dotProduct(p2_p3) * delimeter;
        const gamma = p1_p2.lengthSquared * p3_p1.dotProduct(p3_p2) * delimeter;

        const center = p1.multiplyScalar(alpha)
            .add(p2.multiplyScalar(beta))
            .add(p3.multiplyScalar(gamma));
        const radius = (p1_p2.length * p2_p3.length * p3_p1.length) / (2 * triangleNormal.length);

        return new Sphere(center, radius);
    }
}