import { ExtractModel } from '../../../tables/inferTypes';

export default class SelectResponseFourJoins<T1, T2, T3, T4, T5> {
  public _t1: ExtractModel<T1>[];
  public _t2: ExtractModel<T2>[];
  public _t3: ExtractModel<T3>[];
  public _t4: ExtractModel<T4>[];
  public _t5: ExtractModel<T5>[];

  public constructor(t1: ExtractModel<T1>[],
    t2: ExtractModel<T2>[],
    t3: ExtractModel<T3>[],
    t4: ExtractModel<T4>[],
    t5: ExtractModel<T5>[]) {
    this._t1 = t1;
    this._t2 = t2;
    this._t3 = t3;
    this._t4 = t4;
    this._t5 = t5;
  }

  // public groupBy = (key: keyof ExtractModel<T1>) => {
  //   const objects = this.map((u, c, c1) => ({ u, c, c1 }));
  //   return this._groupBy(objects, (item) => key[item]);
  // };

  public map = <M>(imac: (t1: ExtractModel<T1>,
    t2: ExtractModel<T2>,
    t3: ExtractModel<T3>,
    t4: ExtractModel<T4>,
    t5: ExtractModel<T5>) => M): Array<M> => {
    const objects = new Array<M>();
    for (let i = 0; i < this._t1.length; i += 1) {
      objects.push(imac(this._t1[i], this._t2[i], this._t3[i], this._t4[i], this._t5[i]));
    }
    return objects;
  };

  // private _groupBy = <T, K extends keyof any>(list: T[], getKey: (item: T) => K) => {
  //   list.reduce((previous, currentItem) => {
  //     const group = getKey(currentItem);
  //     // eslint-disable-next-line no-param-reassign
  //     if (!previous[group]) previous[group] = [];
  //     previous[group].push(currentItem);
  //     return previous;
  //   }, {} as Record<K, T[]>);
  // };
}
