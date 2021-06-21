import InsertAggregator from '../../aggregators/insertAggregator';
import ValuesInsert from './valuesInsert';

export default class InsertInto<SERVICE, MODEL> {
  private _aggregator: InsertAggregator<SERVICE, MODEL>;

  public constructor(aggregator: InsertAggregator<SERVICE, MODEL>) {
    this._aggregator = aggregator;
  }

  public values = <T>(values: Array<T>) => new ValuesInsert(this._aggregator).apply(values);

  public build = () => this._aggregator.buildQuery();
}
