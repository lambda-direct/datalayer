import UpdateAggregator from '../../aggregators/updateAggregator';
import UpdateExpr from '../../requestBuilders/updates/updates';
import WhereSet from './whereSet';

export default class UpdateIn<SERVICE> {
  private _aggregator: UpdateAggregator<SERVICE>;

  public constructor(aggregator: UpdateAggregator<SERVICE>) {
    this._aggregator = aggregator;
  }

  public set = (updates: UpdateExpr) => new WhereSet(this._aggregator).apply(updates);

  public build = () => this._aggregator.buildQuery();
}
