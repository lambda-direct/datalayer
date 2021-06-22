import Column from '../../columns/column';
import ColumnType from '../../columns/types/columnType';
import Join from './join';

export default class JoinWith<T extends ColumnType, K> {
  public joinTableName: string;
  public mappedServiceToDb: { [name in keyof K]: Column<ColumnType, {}>; };

  public constructor(joinTableName: string,
    mappedServiceToDb: { [name in keyof K]: Column<ColumnType, {}>; }) {
    this.joinTableName = joinTableName;
    this.mappedServiceToDb = mappedServiceToDb;
  }

  public columns = (fromColumn:Column<T>,
    toColumn:Column<T>): Join<T, K> => new Join(this.joinTableName,
    fromColumn, toColumn, this.mappedServiceToDb);
}
