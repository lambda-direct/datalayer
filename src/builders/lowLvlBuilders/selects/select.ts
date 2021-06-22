import Column from '../../../columns/column';
import ColumnType from '../../../columns/types/columnType';
import SelectAggregator from '../../aggregators/selectAggregator';
import SelectFrom from './selectFrom';

export default class Select {
  // TODO Add from with tableName as param
  public static from = (tableName: string, columns: Column<ColumnType, {}>[]) => {
    const aggregator = new SelectAggregator(tableName);
    aggregator.appendFrom(tableName).appendFields(columns);
    return new SelectFrom(aggregator);
  };
}
