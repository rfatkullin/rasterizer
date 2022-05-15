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
        let intensity = new Color(0, 0, 0);

        intensity = ColorUtils.add(intensity, ambient);

        for (let light of this._light.directs) {
            intensity = ColorUtils.add(intensity, this.calculteDiffuse(light, normal));
            const v = this._camera.position.sub(vertex);
            intensity = ColorUtils.add(intensity, this.calculteSpecular(light, normal, v));
        }

        return new Color(color.r * intensity.r, color.g * intensity.g, color.b * intensity.b);
    }

    private calculteDiffuse(light: DirectLight, normal: Point3f): Color {
        const intensity = Math.max(light.direction.dotProduct(normal) / light.direction.length, 0);
        const diffuse = new Color(intensity * light.color.r, intensity * light.color.g, intensity * light.color.b);
        return diffuse;
    }

    private calculteSpecular(light: DirectLight, normal: Point3f, v: Point3f): Color {
        const r = normal.multiplyScalar(2 * normal.dotProduct(light.direction)).sub(light.direction);
        const dotProduct =  Math.max(r.dotProduct(v) / (r.length * v.length), 0);
        const intensity = Math.pow(dotProduct, 10);

        return new Color(intensity * light.color.r, intensity * light.color.g, intensity * light.color.b);
    }
}