import UpdateAggregator from '../../aggregators/updateAggregator';
import { UpdateExpr } from '../../requestBuilders/updates/updates';
import { Expr } from '../../requestBuilders/where/where';
import WhereSelect from './whereSelect';

export default class WhereSet<SERVICE, DB> {
  private _aggregator: UpdateAggregator<SERVICE>;

  public constructor(aggregator: UpdateAggregator<SERVICE>) {
    this._aggregator = aggregator;
  }

  public apply = (updates: UpdateExpr): WhereSet<SERVICE, DB> => {
    this._aggregator.set(updates);
    return this;
  };

  public filteredBy = (filters: Expr) => new WhereSelect(this._aggregator).apply(filters);

  public build = () => this._aggregator.buildQuery();
}
