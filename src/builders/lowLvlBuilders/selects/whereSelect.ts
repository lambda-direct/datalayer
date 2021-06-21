import SelectAggregator from '../../aggregators/selectAggregator';
import Expr from '../../requestBuilders/where/where';

export default class WhereSelect<SERVICE, DB> {
  private _aggregator: SelectAggregator<SERVICE>;

  public constructor(aggregator: SelectAggregator<SERVICE>) {
    this._aggregator = aggregator;
  }

  public apply = (filters: Expr): WhereSelect<SERVICE, DB> => {
    this._aggregator.filters(filters);
    return this;
  };

  public build = () => this._aggregator.buildQuery();
}
