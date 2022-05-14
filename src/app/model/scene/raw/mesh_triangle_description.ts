export class MeshTriangleDescription {
    public constructor(
        public readonly indices: number[],
        public readonly colors: string[],
        public readonly normals: number[][]) { }
}