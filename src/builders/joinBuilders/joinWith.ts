import { Column, IndexedColumn } from '../../columns/column';
import ColumnType from '../../columns/types/columnType';
import { ExtractModel } from '../../tables/inferTypes';
import Join from './join';

export default class JoinWith<T extends ColumnType, K> {
  public joinTableName: string;
  public mappedServiceToDb: { [name in keyof ExtractModel<K>]: Column<ColumnType>; };

  public constructor(joinTableName: string,
    mappedServiceToDb: { [name in keyof ExtractModel<K>]: Column<ColumnType>; }) {
    this.joinTableName = joinTableName;
    this.mappedServiceToDb = mappedServiceToDb;
  }

  public columns = (fromColumn: Column<T, boolean, boolean> | IndexedColumn<T, boolean, boolean>,
    toColumn: Column<T, boolean, boolean> | IndexedColumn<T, boolean, boolean>)
  : Join<T, K> => new Join(this.joinTableName,
    fromColumn, toColumn, this.mappedServiceToDb);
}
