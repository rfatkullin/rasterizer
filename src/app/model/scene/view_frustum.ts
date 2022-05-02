export class ViewFrustum {
    public constructor(
        public readonly fovInDegrees: number,
        public readonly near: number,
        public readonly far: number) { }
}