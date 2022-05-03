export class CanvasSettings {
    public constructor(
        public readonly width: number,
        public readonly height: number) {
        if (width < Number.EPSILON || height < Number.EPSILON) {
            throw new Error(`[CanvasSettings]: Canvas width or height is corrupted. Width: ${width}. Height: ${height}.`);
        }
    }

    public get aspectRatio(): number {
        return this.width / this.height;
    }
}