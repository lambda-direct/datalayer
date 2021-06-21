import ColumnType from '../../../columns/types/columnType';
import SelectAggregator from '../../aggregators/selectAggregator';
import Join from '../../joinBuilders/join';
import Expr from '../../requestBuilders/where/where';
import WhereSelect from './whereSelect';

export default class SelectJoined<SERVICE, DB> {
  private _aggregator: SelectAggregator<SERVICE>;

  public constructor(aggregator: SelectAggregator<SERVICE>) {
    this._aggregator = aggregator;
  }

  public apply = <COLUMN extends ColumnType>(joins: Array<Join<COLUMN,
  {}>>): SelectJoined<SERVICE, DB> => {
    this._aggregator.join(joins);
    return this;
  };

  public filteredBy = (filters: Expr) => new WhereSelect(this._aggregator).apply(filters);

  public build = () => this._aggregator.buildQuery();
}
