import { Column } from '../../../columns/column';
import ColumnType from '../../../columns/types/columnType';
import DeleteAggregator from '../../aggregators/deleteAggregator';
import DeleteFrom from './deleteFrom';

export default class Delete {
  public static from = (tableName: string, columns: Column<ColumnType>[]): DeleteFrom => {
    const aggregator = new DeleteAggregator(tableName);
    aggregator.appendFrom(tableName).appendFields(columns);
    return new DeleteFrom(aggregator);
  };
}
