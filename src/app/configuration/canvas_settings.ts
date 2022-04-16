export class CanvasSettings {

    public constructor(private _width: number, private _height: number) { }

    public get Width(): number {
        return this._width;
    }

    public get Height(): number {
        return this._height;
    }
}