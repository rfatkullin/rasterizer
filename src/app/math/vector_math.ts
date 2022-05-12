export class VectorMath {
    public static mult(matrix: number[][], vector: number[]): number[] {
        return [
            matrix[0][0] * vector[0] + matrix[0][1] * vector[1] + matrix[0][2] * vector[2] + matrix[0][3] * vector[3],
            matrix[1][0] * vector[0] + matrix[1][1] * vector[1] + matrix[1][2] * vector[2] + matrix[1][3] * vector[3],
            matrix[2][0] * vector[0] + matrix[2][1] * vector[1] + matrix[2][2] * vector[2] + matrix[2][3] * vector[3],
            matrix[3][0] * vector[0] + matrix[3][1] * vector[1] + matrix[3][2] * vector[2] + matrix[3][3] * vector[3]
        ]
    }

    public static multMatrix(a: number[][], b: number[][]): number[][] {
        const result: number[][] = [];

        for (let i = 0; i < 4; i++) {
            const row: number[] = [];
            for (let j = 0; j < 4; j++) {
                let mult = 0;
                for (let k = 0; k < 4; k++) {
                    mult += a[i][k] * b[k][j];
                }
                row.push(mult);
            }

            result.push(row);
        }

        return result;
    }
}