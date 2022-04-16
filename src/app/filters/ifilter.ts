export interface IFilter {
    apply(pixels: Uint8ClampedArray): void;
}