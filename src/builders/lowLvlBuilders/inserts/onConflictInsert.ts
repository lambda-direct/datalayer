import InsertAggregator from '../../aggregators/insertAggregator';
// import UpdateExpr from '../../requestBuilders/updates/updates';

export default class OnConflictInsert<SERVICE, MODEL> {
  private _aggregator: InsertAggregator<SERVICE, MODEL>;

  public constructor(aggregator: InsertAggregator<SERVICE, MODEL>) {
    this._aggregator = aggregator;
  }

  // public apply = (updates: UpdateExpr): OnConflictInsert<SERVICE, MODEL> => this;

  public build = () => this._aggregator.buildQuery();
}
