import Column from '../../columns/column';
import ColumnType from '../../columns/types/columnType';
import AbstractTable from '../../tables/abstractTable';
import Join from './join';

export default class JoinWith<T extends ColumnType, K> {
  public joinTable: AbstractTable<K>;

  public constructor(joinTable: AbstractTable<K>) {
    this.joinTable = joinTable;
  }

  public columns = (fromColumn:Column<T>,
    toColumn:Column<T>): Join<T, K> => new Join(this.joinTable, fromColumn, toColumn);
}
