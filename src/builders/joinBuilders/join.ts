import { AbstractColumn } from '../../columns/column';
import ColumnType from '../../columns/types/columnType';
import { ExtractModel } from '../../tables/inferTypes';

export default class Join<T extends ColumnType, K> {
  public fromColumn: AbstractColumn<T, boolean, boolean>;
  public toColumn: AbstractColumn<T, boolean, boolean>;
  public joinTableName: string;
  public mappedServiceToDb: { [name in keyof ExtractModel<K>]: AbstractColumn<ColumnType>; };
  public type: JoinStrategy;

  public constructor(joinTableName: string, fromColumn: AbstractColumn<T, boolean, boolean>,
    toColumn: AbstractColumn<T, boolean, boolean>,
    mappedServiceToDb: { [name in keyof ExtractModel<K>]: AbstractColumn<ColumnType>; }) {
    this.joinTableName = joinTableName;
    this.toColumn = toColumn;
    this.fromColumn = fromColumn;
    this.mappedServiceToDb = mappedServiceToDb;
  }

  public joinStrategy = (type: JoinStrategy): Join<T, K> => {
    this.type = type;
    return this;
  };

  public columns = (fromColumn: AbstractColumn<T>, toColumn:AbstractColumn<T>): Join<T, K> => {
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
