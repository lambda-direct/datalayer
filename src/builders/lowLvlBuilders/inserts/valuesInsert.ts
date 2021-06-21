import InsertAggregator from '../../aggregators/insertAggregator';
import UpdateExpr from '../../requestBuilders/updates/updates';
import OnConflictInsert from './onConflictInsert';

export default class ValuesInsert<SERVICE, MODEL> {
  private _aggregator: InsertAggregator<SERVICE, MODEL>;

  public constructor(aggregator: InsertAggregator<SERVICE, MODEL>) {
    this._aggregator = aggregator;
  }

  public apply = <T>(values: Array<T>): ValuesInsert<SERVICE, MODEL> => {
    this._aggregator.appendColumns(values);
    this._aggregator.appendValues(values);

    return this;
  };

  public onConflict = (updates:
  UpdateExpr) => new OnConflictInsert(this._aggregator).apply(updates);

  public build = () => this._aggregator.buildQuery();
}
