import { RendererSettings } from "../configuration/renderer_settings";
import { MeshDescription } from "../model/scene/raw/mesh_description";
import { MeshTriangleDescription } from "../model/scene/raw/mesh_triangle_description";

export class SphereMeshGenerator {
    public static generateSphereMesh(meshName: string, color: string): MeshDescription {
        const verticalSectionsNumber: number = RendererSettings.SphereDetalizationFactor;
        const horizontalSectionsNumber: number = RendererSettings.SphereDetalizationFactor;
        const sphereVertices: number[][] = this.generateUnitSphereVertices(verticalSectionsNumber, horizontalSectionsNumber);
        const sphereTriangles = this.generateSphereTriangles(sphereVertices, horizontalSectionsNumber, color);

        return {
            name: meshName,
            vertices: sphereVertices,
            triangles: sphereTriangles
        }
    }

    private static generateUnitSphereVertices(verticalSectionsNumber: number, horizontalSectionsNumber: number): number[][] {
        const sphereRadius: number = 0.5;
        const vertices: number[][] = [];

        // bottom vertex of sphere
        vertices.push([0, -sphereRadius, 0, 1]);

        for (let i = 1; i < verticalSectionsNumber; i++) {
            const currentTheta = ((i / verticalSectionsNumber) - 0.5) * Math.PI;

            let currentRadius = sphereRadius;
            if (Math.abs(currentTheta) > Number.EPSILON) {
                currentRadius = sphereRadius * Math.cos(currentTheta);
            }

            let y = sphereRadius * Math.sin(currentTheta);
            for (let j = 0; j < horizontalSectionsNumber; j++) {
                const currentAlpha = (j / horizontalSectionsNumber) * 2 * Math.PI;
                const z = currentRadius * Math.sin(currentAlpha);
                const x = currentRadius * Math.cos(currentAlpha);

                vertices.push([x, y, z, 1]);
            }
        }

        // top vertex of sphere
        vertices.push([0, sphereRadius, 0, 1]);

        return vertices;
    }

    private static generateSphereTriangles(vertices: number[][], horizontalSectionsNumber: number, color: string): MeshTriangleDescription[] {
        const triangles: MeshTriangleDescription[] = []
        const colors = [color, color, color];

        for (let i = 0; i < horizontalSectionsNumber; i++) {
            const index1 = 0;
            const index2 = i + 1;
            const index3 = (i + 1) % horizontalSectionsNumber + 1;

            triangles.push(
                {
                    indices: [index1, index2, index3],
                    colors: colors,
                    normals: [
                        this.getSphereVertexNormal(vertices[index1]),
                        this.getSphereVertexNormal(vertices[index2]),
                        this.getSphereVertexNormal(vertices[index3])
                    ]
                }
            );
        }

        for (let i = horizontalSectionsNumber + 1; i < vertices.length - 1; i++) {
            const index1 = i - horizontalSectionsNumber;
            const index2 = i;
            let index3 = i + 1;
            let index4 = i - horizontalSectionsNumber + 1;

            if (i % horizontalSectionsNumber == 0) {
                index3 -= horizontalSectionsNumber;
                index4 -= horizontalSectionsNumber;
            }

            triangles.push(
                {
                    indices: [index1, index2, index3],
                    colors: colors,
                    normals: [
                        this.getSphereVertexNormal(vertices[index1]),
                        this.getSphereVertexNormal(vertices[index2]),
                        this.getSphereVertexNormal(vertices[index3])
                    ]
                }
            );

            triangles.push(
                {
                    indices: [index4, index1, index3],
                    colors: colors,
                    normals: [
                        this.getSphereVertexNormal(vertices[index4]),
                        this.getSphereVertexNormal(vertices[index1]),
                        this.getSphereVertexNormal(vertices[index3])
                    ]
                }
            );
        }

        for (let i = vertices.length - 1 - horizontalSectionsNumber; i < vertices.length - 1; i++) {
            const index1 = vertices.length - 1;
            const index2 = i;
            const index3 = i + 1 == vertices.length - 1 ? vertices.length - 1 - horizontalSectionsNumber : i + 1;

            triangles.push(
                {
                    indices: [index1, index2, index3],
                    colors: colors,
                    normals: [
                        this.getSphereVertexNormal(vertices[index1]),
                        this.getSphereVertexNormal(vertices[index2]),
                        this.getSphereVertexNormal(vertices[index3])
                    ]
                }
            );
        }

        return triangles;
    }

    private static getSphereVertexNormal(vertex: number[]): number[] {
        const length = Math.sqrt(vertex[0] * vertex[0] + vertex[1] * vertex[1] + vertex[2] * vertex[2]);

        return [vertex[0] / length, vertex[1] / length, vertex[2] / length];
    }
}