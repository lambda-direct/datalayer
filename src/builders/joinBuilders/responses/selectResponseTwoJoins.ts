export class SelectResponseTwoJoins<T1, T2, T3, DB> {
    private _t1: T1[];
    private _t2: T2[];
    private _t3: T3[];

    constructor(t1: T1[], t2: T2[], t3: T3[]) {
        this._t1 = t1;
        this._t2 = t2;
        this._t3 = t3;
    }

    public mapRes<M>(imac: (t1: T1, t2: T2, t3: T3) => M): Array<M> {
        const objects = new Array<M>();
        for (let i = 0; i < this._t1.length; i++) {
            objects.push(imac(this._t1[i], this._t2[i], this._t3[i]));
        }
        return objects;
    }
}