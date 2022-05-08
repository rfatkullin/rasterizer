import { RendererSettings } from "../configuration/renderer_settings";
import { ColorUtils } from "../utils/color_utils";

export class SphereMeshGenerator {
    public static generateSphereMesh(meshName: string): { name: string, vertices: number[][], triangles: { color: string, indices: number[] }[] } {
        const verticalSectionsNumber: number = RendererSettings.SphereDetalizationFactor;
        const horizontalSectionsNumber: number = RendererSettings.SphereDetalizationFactor;
        const sphereVertices: number[][] = this.generateUnitSphereVertices(verticalSectionsNumber, horizontalSectionsNumber);
        const sphereTriangles = this.generateSphereTriangles(sphereVertices, horizontalSectionsNumber);

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

    private static generateSphereTriangles(vertices: number[][], horizontalSectionsNumber: number): { color: string, indices: number[] }[] {
        const triangles: { color: string, indices: number[] }[] = []

        for (let i = 0; i < horizontalSectionsNumber; i++) {
            triangles.push(
                {
                    color: ColorUtils.getRandomColorName(),
                    indices: [0, i + 1, (i + 1) % horizontalSectionsNumber + 1]
                }
            );
        }

        for (let i = horizontalSectionsNumber + 1; i < vertices.length - 1; i++) {
            let nextIndex = i + 1;
            let nextIndex2 = i - horizontalSectionsNumber + 1;
            if (i % horizontalSectionsNumber == 0) {
                nextIndex -= horizontalSectionsNumber;
                nextIndex2 -= horizontalSectionsNumber;
            }

            triangles.push(
                {
                    color: ColorUtils.getRandomColorName(),
                    indices: [i - horizontalSectionsNumber, i, nextIndex]
                }
            );

            triangles.push(
                {
                    color: ColorUtils.getRandomColorName(),
                    indices: [nextIndex2, i - horizontalSectionsNumber, nextIndex]
                }
            );
        }

        for (let i = vertices.length - 1 - horizontalSectionsNumber; i < vertices.length - 1; i++) {
            triangles.push(
                {
                    color: ColorUtils.getRandomColorName(),
                    indices: [vertices.length - 1, i, i + 1 == vertices.length - 1 ? vertices.length - 1 - horizontalSectionsNumber : i + 1]
                }
            );
        }

        return triangles;
    }
}