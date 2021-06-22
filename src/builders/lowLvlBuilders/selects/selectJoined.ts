import ColumnType from '../../../columns/types/columnType';
import SelectAggregator from '../../aggregators/selectAggregator';
import Join from '../../joinBuilders/join';
import Expr from '../../requestBuilders/where/where';
import WhereSelect from './whereSelect';

export default class SelectJoined {
  private _aggregator: SelectAggregator;

  public constructor(aggregator: SelectAggregator) {
    this._aggregator = aggregator;
  }

  public apply = <COLUMN extends ColumnType>(joins: Array<Join<COLUMN,
  {}>>): SelectJoined => {
    this._aggregator.join(joins);
    return this;
  };

  public filteredBy = (filters: Expr) => new WhereSelect(this._aggregator).apply(filters);

  public build = () => this._aggregator.buildQuery();
}
