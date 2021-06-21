import { Pool } from 'pg';
import Column from '../../columns/column';
import ColumnType from '../../columns/types/columnType';

export default abstract class TableRequestBuilder<T> {
  protected _tableName: string;
  protected _pool: Pool;
  protected _mappedServiceToDb: { [name in keyof T]: Column<ColumnType, {}>; };
  protected _columns: Column<ColumnType, {}>[];

  public constructor(tableName: string,
    pool: Pool,
    mappedServiceToDb: { [name in keyof T]: Column<ColumnType, {}>; },
    columns: Column<ColumnType, {}>[]) {
    this._mappedServiceToDb = mappedServiceToDb;
    this._tableName = tableName;
    this._pool = pool;
    this._columns = columns;
  }

  public all = async (): Promise<T[]> => this.execute();

  public first = async (): Promise<T> => {
    const executionRes = await this.execute();
    // TODO add checks for undefined or null
    return executionRes[0];
  };

  protected abstract execute(): Promise<Array<T>>;
}
