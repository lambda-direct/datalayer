import { ExtractModel } from '../../../tables/inferTypes';

export default class SelectResponseTwoJoins<T1, T2, T3> {
  private _t1: ExtractModel<T1>[];
  private _t2: ExtractModel<T2>[];
  private _t3: ExtractModel<T3>[];

  public constructor(t1: ExtractModel<T1>[], t2: ExtractModel<T2>[], t3: ExtractModel<T3>[]) {
    this._t1 = t1;
    this._t2 = t2;
    this._t3 = t3;
  }

  public mapByRow = <M>(imac: (t1: ExtractModel<T1>, t2:
  ExtractModel<T2>, t3: ExtractModel<T3>) => M): Array<M> => {
    const objects = new Array<M>();
    for (let i = 0; i < this._t1.length; i += 1) {
      objects.push(imac(this._t1[i], this._t2[i], this._t3[i]));
    }
    return objects;
  };
}
