import ColumnType from '../../../columns/types/columnType';
import SelectAggregator from '../../aggregators/selectAggregator';
import Join from '../../joinBuilders/join';
import Expr from '../../requestBuilders/where/where';
import SelectJoined from './selectJoined';
import WhereSelect from './whereSelect';

export default class SelectFrom<SERVICE> {
  private _aggregator: SelectAggregator<SERVICE>;

  public constructor(aggregator: SelectAggregator<SERVICE>) {
    this._aggregator = aggregator;
  }

  public joined = <COLUMN extends ColumnType>(joins: Array<Join<COLUMN, any>>) => new SelectJoined(this._aggregator).apply(joins);

  public filteredBy = (filters: Expr) => new WhereSelect(this._aggregator).apply(filters);

  public build = () => this._aggregator.buildQuery();
}
