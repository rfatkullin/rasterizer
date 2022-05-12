import { MeshTriangleDescription } from "./mesh_triangle_description";

export class MeshDescription {
    public constructor(
        public readonly name: string,
        public readonly vertices: number[][],
        public readonly triangles: MeshTriangleDescription[]) { }
}