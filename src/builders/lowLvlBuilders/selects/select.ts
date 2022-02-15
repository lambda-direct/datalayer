/* eslint-disable import/no-cycle */
import AbstractTable from '../../../tables/abstractTable';
import SelectAggregator from '../../aggregators/selectAggregator';
import SelectFrom from './selectFrom';

export default class Select {
  // eslint-disable-next-line max-len
  public static from = <TTable extends AbstractTable<TTable>>(table: AbstractTable<TTable>) => {
    const aggregator = new SelectAggregator(table);
    aggregator.appendFrom(table.tableName());
    return new SelectFrom(aggregator);
  };
}
