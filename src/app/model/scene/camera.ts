import { Point3f } from "../geometry/point3f";
import { ViewFrustum } from "./view_frustum";

export class Camera {
    public constructor(
        public readonly position: Point3f,
        public readonly frustum: ViewFrustum) { }
}