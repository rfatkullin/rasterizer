import { Color } from "../materials/color";

export class TriangleDescription {
    public constructor(
        public readonly indices: number[],
        public readonly colors: Color[],
        public readonly normals: number[][]) { }
}