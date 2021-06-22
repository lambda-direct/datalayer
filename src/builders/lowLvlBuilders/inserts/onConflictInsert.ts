import InsertAggregator from '../../aggregators/insertAggregator';
// import UpdateExpr from '../../requestBuilders/updates/updates';

export default class OnConflictInsert {
  private _aggregator: InsertAggregator;

  public constructor(aggregator: InsertAggregator) {
    this._aggregator = aggregator;
  }

  // public apply = (updates: UpdateExpr): OnConflictInsert<SERVICE, MODEL> => this;

  public build = () => this._aggregator.buildQuery();
}
