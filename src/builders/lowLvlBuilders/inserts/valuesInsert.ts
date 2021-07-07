import Column from '../../../columns/column';
import ColumnType from '../../../columns/types/columnType';
import { ExtractModel } from '../../../tables/inferTypes';
import InsertAggregator from '../../aggregators/insertAggregator';

export default class ValuesInsert {
  private _aggregator: InsertAggregator;

  public constructor(aggregator: InsertAggregator) {
    this._aggregator = aggregator;
  }

  public apply = <T>(values: {[name: string]: any}[], columns: {[name in keyof ExtractModel<T>]
    : Column<ColumnType>})
  : ValuesInsert => {
    this._aggregator.appendColumns(values);
    this._aggregator.appendValues(columns, values);

    return this;
  };

  // public onConflict = (updates:
  // UpdateExpr) => new OnConflictInsert(this._aggregator).apply(updates);

  public build = () => this._aggregator.buildQuery();
}
