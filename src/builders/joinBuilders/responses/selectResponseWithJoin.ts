import { ExtractModel } from '../../../tables/inferTypes';

export default class SelectResponseJoin<MODEL, T2> {
  private _t1: ExtractModel<MODEL>[];
  private _t2: ExtractModel<T2>[];

  public constructor(t1: ExtractModel<MODEL>[], t2: ExtractModel<T2>[]) {
    this._t1 = t1;
    this._t2 = t2;
  }

  public mapByRow = <M>(imac: (t1: ExtractModel<MODEL>, t2: ExtractModel<T2>) => M): Array<M> => {
    const objects = new Array<M>();
    for (let i = 0; i < this._t1.length; i += 1) {
      objects.push(imac(this._t1[i], this._t2[i]));
    }
    return objects;
  };

  public mapByResult = <M>(imac: (t1: ExtractModel<MODEL>, t2: ExtractModel<T2>) => M)
  : Array<M> => {
    const objects = new Array<M>();
    for (let i = 0; i < this._t1.length; i += 1) {
      objects.push(imac(this._t1[i], this._t2[i]));
    }
    return objects;
  };
}
