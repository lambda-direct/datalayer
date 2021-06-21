import Column from '../../columns/column';
import ColumnType from '../../columns/types/columnType';
import AbstractTable from '../../tables/abstractTable';
import JoinWith from './joinWith';

export default class Join<T extends ColumnType, K> {
  public fromColumn: Column<T>;
  public toColumn: Column<T>;
  public joinTable: AbstractTable<K>;
  public type: JoinStrategy;

  public constructor(joinTable: AbstractTable<K>, fromColumn: Column<T>, toColumn: Column<T>) {
    this.joinTable = joinTable;
    this.toColumn = toColumn;
    this.fromColumn = fromColumn;
  }

  public static with = <T extends ColumnType, K>(table: AbstractTable<K>):
  JoinWith<T, K> => new JoinWith(table);

  public joinStrategy = (type: JoinStrategy): Join<T, K> => {
    this.type = type;
    return this;
  };

  public columns = (fromColumn:Column<T>, toColumn:Column<T>): Join<T, K> => {
    this.toColumn = toColumn;
    this.fromColumn = fromColumn;
    return this;
  };
}

export enum JoinStrategy {
  INNER_JOIN = 'INNER JOIN',
  LEFT_JOIN = 'LEFT JOIN',
  RIGHT_JOIN = 'RIGHT JOIN',
}
