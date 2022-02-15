/* eslint-disable import/no-cycle */
import { Column } from '../../../columns/column';
import ColumnType from '../../../columns/types/columnType';
import { AbstractTable } from '../../../tables';
import DeleteAggregator from '../../aggregators/deleteAggregator';
import DeleteFrom from './deleteFrom';

export default class Delete {
  public static from = (table: AbstractTable<any>, columns: Column<ColumnType>[]): DeleteFrom => {
    const aggregator = new DeleteAggregator(table);
    aggregator.appendFrom(table.tableName()).appendFields(columns);
    return new DeleteFrom(aggregator);
  };
}
