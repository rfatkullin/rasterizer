export class Point3f {
    private _length: number | null = null;
    private _lenghtSquared: number | null = null;

    constructor(
        public readonly x: number,
        public readonly y: number,
        public readonly z: number) { }

    public get length(): number {
        if (this._length == null) {
            this.calculateLength();
        }

        return this._length;
    }

    public get lengthSquared(): number {
        if (this._length == null) {
            this.calculateLength();
        }

        return this._lenghtSquared;
    }

    public sub(other: Point3f): Point3f {
        return new Point3f(this.x - other.x, this.y - other.y, this.z - other.z);
    }

    public add(other: Point3f): Point3f {
        return new Point3f(this.x + other.x, this.y + other.y, this.z + other.z);
    }

    public multiplyScalar(scalar: number): Point3f {
        return new Point3f(this.x * scalar, this.y * scalar, this.z * scalar)
    }

    public dotProduct(other: Point3f): number {
        return this.x * other.x + this.y * other.y + this.z * other.z;
    }

    public crossProduct(other: Point3f): Point3f {
        return new Point3f(
            this.y * other.z - this.z * other.y,
            this.z * other.x - this.x * other.z,
            this.x * other.y - this.y * other.x);
    }

    private calculateLength(): void {
        this._lenghtSquared = this.dotProduct(this);
        this._length = Math.sqrt(this._lenghtSquared);
    }
}