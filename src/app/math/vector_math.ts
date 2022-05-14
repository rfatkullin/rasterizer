export class VectorMath {
    public static mult(matrix: number[][], vector: number[]): number[] {
        const matrixRowNumber = matrix.length;
        const matrixColumnsNumber = matrix[0].length;
        const vectorRowNumber = vector.length;

        if (matrixColumnsNumber != vectorRowNumber) {
            throw new Error("Matrix by vector multiplication has wrong dimensions.");
        }

        const result = [];
        for (let i = 0; i < matrixRowNumber; i++) {
            let mult = 0;
            for (let k = 0; k < vectorRowNumber; k++) {
                mult += matrix[i][k] * vector[k];
            }
            result.push(mult);
        }

        return result;
    }

    public static interpolateNormals(a: number[], b: number[], t: number): number[] {
        const vector: number[] = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];

        return [a[0] + t * vector[0], a[1] + t * vector[1], a[2] + t * vector[2]];
    }

    public static transpose(m: number[][]): number[][] {
        const result: number[][] = [];

        for (let i = 0; i < m[0].length; i++) {
            result[i] = [];
        }

        for (let i = 0; i < m.length; i++) {
            for (let j = 0; j < m[i].length; j++) {
                result[j][i] = m[i][j]
            }
        }

        return result;
    }

    public static inverse3by3Matrix(m: number[][]): number[][] {
        const invertedMatrixDet = 1 / this.getDeterminant3by3(m);

        const a = this.getDeterminant2by2(m[1][1], m[1][2], m[2][1], m[2][2]) * invertedMatrixDet;
        const b = this.getDeterminant2by2(m[0][2], m[0][1], m[2][2], m[2][1]) * invertedMatrixDet;
        const c = this.getDeterminant2by2(m[0][1], m[0][2], m[1][1], m[1][2]) * invertedMatrixDet;
        const d = this.getDeterminant2by2(m[1][2], m[1][0], m[2][2], m[2][0]) * invertedMatrixDet;
        const e = this.getDeterminant2by2(m[0][0], m[0][2], m[2][0], m[2][2]) * invertedMatrixDet;
        const f = this.getDeterminant2by2(m[0][2], m[0][0], m[1][2], m[1][0]) * invertedMatrixDet;
        const g = this.getDeterminant2by2(m[1][0], m[1][1], m[2][0], m[2][1]) * invertedMatrixDet;
        const h = this.getDeterminant2by2(m[0][1], m[0][0], m[2][1], m[2][0]) * invertedMatrixDet;
        const i = this.getDeterminant2by2(m[0][0], m[0][1], m[1][0], m[1][1]) * invertedMatrixDet;

        return [
            [a, b, c],
            [d, e, f],
            [g, h, i]
        ]
    }

    private static getDeterminant3by3(m: number[][]): number {
        return m[0][0] * this.getDeterminant2by2(m[1][1], m[1][2], m[2][1], m[2][2])
            - m[0][1] * this.getDeterminant2by2(m[1][0], m[1][2], m[2][0], m[2][2])
            + m[0][2] * this.getDeterminant2by2(m[1][0], m[1][1], m[2][0], m[2][1]);
    }

    private static getDeterminant2by2(a: number, b: number, c: number, d: number): number {
        return a * d - b * c;
    }

    public static getSubMatrix(matrix: number[][], rowNumber: number, columnNumber: number): number[][] {
        const result: number[][] = [];

        for (let i = 0; i < rowNumber; i++) {
            result.push(matrix[i].slice(0, columnNumber));
        }

        return result;
    }

    public static multMatrix(a: number[][], b: number[][]): number[][] {
        const aRowNumber = a.length;
        const aColumnsNumber = a[0].length;
        const bRowNumber = b.length;
        const bColumnNumber = b[0].length;

        if (aColumnsNumber != bRowNumber) {
            throw new Error("Matrix by matrix multiplication has wrong dimensions.");
        }

        const result: number[][] = [];

        for (let i = 0; i < aRowNumber; i++) {
            const row: number[] = [];
            for (let j = 0; j < bColumnNumber; j++) {
                let mult = 0;
                for (let k = 0; k < aColumnsNumber; k++) {
                    mult += a[i][k] * b[k][j];
                }
                row.push(mult);
            }

            result.push(row);
        }

        return result;
    }
}