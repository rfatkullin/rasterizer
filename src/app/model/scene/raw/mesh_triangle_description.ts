export class MeshTriangleDescription {
    public constructor(
        public readonly color: string,
        public readonly indices: number[],
        public readonly normals: number[][]) { }
}