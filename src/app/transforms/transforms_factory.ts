import { Point3f } from "../model/geometry/point3f";

export class TransformFactory {
    public static getTranslationMatrix(translate: Point3f): number[][] {
        return [
            [1, 0, 0, translate.x],
            [0, 1, 0, translate.y],
            [0, 0, 1, translate.z],
            [0, 0, 0, 1]
        ]
    }

    public static getUniformScaleMatrix(scaleFactor: number): number[][] {
        return [
            [scaleFactor, 0, 0, 0],
            [0, scaleFactor, 0, 0],
            [0, 0, scaleFactor, 0],
            [0, 0, 0, 1]
        ]
    }

    public static getScaleMatrix(scale: Point3f): number[][] {
        return [
            [scale.x, 0, 0, 0],
            [0, scale.y, 0, 0],
            [0, 0, scale.z, 0],
            [0, 0, 0, 1]
        ]
    }

    public static getRotationMatrix(rotation: Point3f): number[][] {
        const alpha: number = this.degreeToRadian(rotation.x);
        const beta: number = this.degreeToRadian(rotation.y);
        const gamma: number = this.degreeToRadian(rotation.z);

        const sinAlpha: number = Math.sin(alpha);
        const cosAlpha: number = Math.cos(alpha);

        const sinBeta: number = Math.sin(beta);
        const cosBeta: number = Math.cos(beta);

        const sinGamma: number = Math.sin(gamma);
        const cosGamma: number = Math.cos(gamma);

        return [
            [cosBeta * cosGamma, sinAlpha * sinBeta * cosGamma - cosAlpha * sinGamma, cosAlpha * sinBeta * cosGamma + sinAlpha * sinGamma, 0],
            [cosBeta * sinGamma, sinAlpha * sinBeta * sinGamma + cosAlpha * cosGamma, cosAlpha * sinBeta * sinGamma - sinAlpha * cosGamma, 0],
            [-sinBeta, sinAlpha * cosBeta, cosAlpha * cosBeta, 0],
            [0, 0, 0, 1]
        ]
    }

    private static degreeToRadian(angle: number): number {
        return angle / 180.0 * Math.PI;
    }
}