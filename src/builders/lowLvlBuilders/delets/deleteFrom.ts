import DeleteAggregator from '../../aggregators/deleteAggregator';
import Expr from '../../requestBuilders/where/where';
import DeleteFilter from './deleteFilter';

export default class DeleteFrom<SERVICE> {
  private _aggregator: DeleteAggregator<SERVICE>;

  public constructor(aggregator: DeleteAggregator<SERVICE>) {
    this._aggregator = aggregator;
  }

  public build = () => this._aggregator.buildQuery();

  public filteredBy = (filters: Expr) => new DeleteFilter(this._aggregator).apply(filters);
}
