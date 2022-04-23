import { Plane } from "./model/geometry/plane";

export class Clipping {
    private readonly _planes: Plane[];

    public constructor(fovInDegrees: number, nearDistance: number, farDistance: number) {
        this._planes = this.prepareClippingPlanes(fovInDegrees, nearDistance, farDistance);
    }

    private prepareClippingPlanes(fovInDegrees: number, nearDistance: number, farDistance: number): Plane[] {
        const fovHalfInRadians: number = fovInDegrees / 90 * Math.PI;

        const sinValue: number = Math.sin(fovHalfInRadians);
        const cosValue: number = Math.sin(fovHalfInRadians);

        return [
            // Near plane
            new Plane({ x: 0, y: 0, z: 1 }, -nearDistance),
            // Far plane
            new Plane({ x: 0, y: 0, z: -1 }, -farDistance),
            // Right plane
            new Plane({ x: cosValue, y: 0, z: sinValue }, 0),
            // Left plane
            new Plane({ x: -cosValue, y: 0, z: sinValue }, 0),
            // Top plane
            new Plane({ x: 0, y: sinValue, z: cosValue }, 0),
            // Bottom plane
            new Plane({ x: 0, y: -sinValue, z: cosValue }, 0),
        ]
    }

}