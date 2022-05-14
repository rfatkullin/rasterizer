import { TriangleDescription } from "./triangle_description";

export class FigureDescription {
    public constructor(
        public readonly name: string,
        public readonly vertices: number[][],        
        public readonly triangles: TriangleDescription[]) { }
}