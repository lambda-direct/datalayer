import AbstractTable from '../../../tables/abstractTable';
import SelectAggregator from '../../aggregators/selectAggregator';
import SelectFrom from './selectFrom';

export default class Select {
  // TODO Add from with tableName as param
  public static from = <SERVICE>(table: AbstractTable<SERVICE>) => {
    const aggregator = new SelectAggregator(table);
    aggregator.appendFrom(table).appendFields();
    return new SelectFrom(aggregator);
  };
}
