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