import SelectAggregator from '../../aggregators/selectAggregator';
import Expr from '../../requestBuilders/where/where';

export default class WhereSelect {
  private _aggregator: SelectAggregator;

  public constructor(aggregator: SelectAggregator) {
    this._aggregator = aggregator;
  }

  public apply = (filters: Expr): WhereSelect => {
    this._aggregator.filters(filters);
    return this;
  };

  public build = () => this._aggregator.buildQuery();
}
