/* eslint-disable import/no-cycle */
import { Column } from '../../../columns/column';
import ColumnType from '../../../columns/types/columnType';
import { AbstractTable } from '../../../tables';
import InsertAggregator from '../../aggregators/insertAggregator';
import InsertInto from './insertInto';

export default class Insert {
  public static into = (table: AbstractTable<any>, columns: Column<ColumnType>[]) => {
    const aggregator = new InsertAggregator(table);
    aggregator.appendFrom(table.tableName()).appendFields(columns);
    return new InsertInto(aggregator);
  };
}
