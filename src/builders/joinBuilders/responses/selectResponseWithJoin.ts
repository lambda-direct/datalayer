export class SelectResponseJoin<MODEL, T2> { 
    private _t1: MODEL[];
    private _t2: T2[];

    constructor(t1: MODEL[], t2: T2[]) {
        this._t1 = t1;
        this._t2 = t2;
    }

    public mapByRow<M>(imac: (t1: MODEL, t2: T2) => M): Array<M> {
        const objects = new Array<M>();
        for (let i = 0; i < this._t1.length; i++) {
            objects.push(imac(this._t1[i], this._t2[i]));
        }
        return objects;
    }

    public mapByResult<M>(imac: (t1: MODEL, t2: T2) => M): Array<M> {
        const objects = new Array<M>();
        for (let i = 0; i < this._t1.length; i++) {
            objects.push(imac(this._t1[i], this._t2[i]));
        }
        return objects;
    }
}