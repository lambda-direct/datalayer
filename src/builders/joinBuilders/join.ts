import { Column } from '../../columns/column';
import ColumnType from '../../columns/types/columnType';
import { ExtractModel } from '../../tables/inferTypes';

export default class Join<T extends ColumnType, K> {
  public fromColumn: Column<T, boolean, boolean>;
  public toColumn: Column<T, boolean, boolean>;
  public joinTableName: string;
  public mappedServiceToDb: { [name in keyof ExtractModel<K>]: Column<ColumnType>; };
  public type: JoinStrategy;

  public constructor(joinTableName: string, fromColumn: Column<T, boolean, boolean>,
    toColumn: Column<T, boolean, boolean>,
    mappedServiceToDb: { [name in keyof ExtractModel<K>]: Column<ColumnType>; }) {
    this.joinTableName = joinTableName;
    this.toColumn = toColumn;
    this.fromColumn = fromColumn;
    this.mappedServiceToDb = mappedServiceToDb;
  }

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
