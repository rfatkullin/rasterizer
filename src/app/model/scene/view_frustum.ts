export class ViewFrustum {
    public constructor(
        public readonly horizontalFov: number,
        public readonly verticalFov: number,
        public readonly near: number,
        public readonly far: number) { }
}