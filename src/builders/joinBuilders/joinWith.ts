import Column from '../../columns/column';
import ColumnType from '../../columns/types/columnType';
// Was commented as long as table was injected in constructor
// eslint-disable-next-line import/no-cycle
import AbstractTable from '../../tables/abstractTable';
// Was commented as long as table was injected in constructor
// eslint-disable-next-line import/no-cycle
import Join from './join';

export default class JoinWith<T extends ColumnType, K> {
  public joinTable: AbstractTable<K>;

  public constructor(joinTable: AbstractTable<K>) {
    this.joinTable = joinTable;
  }

  public columns = (fromColumn:Column<T>,
    toColumn:Column<T>): Join<T, K> => new Join(this.joinTable, fromColumn, toColumn);
}
