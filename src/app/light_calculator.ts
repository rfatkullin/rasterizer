import { Point3f } from "./model/geometry/point3f";
import { Color } from "./model/materials/color";
import { Camera } from "./model/scene/camera";
import { DirectLight } from "./model/scene/direct_light";
import { Lighting } from "./model/scene/lighting";
import { ColorUtils } from "./utils/color_utils";

export class LightCalculator {
    public constructor(private readonly _light: Lighting,
        private readonly _camera: Camera) { }

    public calculateColor(vertex: Point3f, normal: Point3f, color: Color): Color {
        const ambient = new Color(color.r * this._light.ambient.r, color.g * this._light.ambient.g, color.b * this._light.ambient.b);
        const normalLength: number = normal.length;

        let totalColor = new Color(0, 0, 0);

        totalColor = ColorUtils.add(totalColor, ambient);

        for (let light of this._light.directs) {
            totalColor = ColorUtils.add(totalColor, this.calculteDiffuse(light, normal, normalLength, color));
            const v = this._camera.position.sub(vertex);
            totalColor = ColorUtils.add(totalColor, this.calculteSpecular(light, normal, v, color));
        }

        return totalColor;
    }

    private calculteDiffuse(light: DirectLight, normal: Point3f, normalLength: number, color: Color): Color {
        const intensity = Math.max(light.direction.dotProduct(normal) / (light.direction.length * normalLength), 0);
        const diffuse = new Color(color.r * intensity * light.color.r, color.g * intensity * light.color.g, color.b * intensity * light.color.b);

        return diffuse;
    }

    private calculteSpecular(light: DirectLight, normal: Point3f, v: Point3f, color: Color): Color {
        const r = normal.multiplyScalar(2 * normal.dotProduct(light.direction)).sub(light.direction);
        const intensity = Math.pow(r.dotProduct(v) / (r.length * v.length), 10);

        return new Color(color.r * intensity * light.color.r, color.g * intensity * light.color.g, color.b * intensity * light.color.b);
    }
}