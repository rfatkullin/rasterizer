export class TrigonometryUtils {
    public static toRadians(angleInDegrees: number): number {
        return angleInDegrees / 180 * Math.PI
    }
}