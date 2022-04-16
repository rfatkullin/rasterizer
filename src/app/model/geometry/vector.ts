export class Vector {
    public x: number;
    public y: number;
    public z: number;
    public w: number;

    constructor(newX: number, newY: number, newZ: number) {
        this.x = newX;
        this.y = newY;
        this.z = newZ;
        this.w = 1;
    }
}