import { Pool } from 'pg';
import AbstractTable from '../../tables/abstractTable';

export default abstract class TableRequestBuilder<T> {
  protected _table: AbstractTable<T>;
  protected _pool: Pool;

  public constructor(table: AbstractTable<T>, pool: Pool) {
    this._table = table;
    this._pool = pool;
  }

  public all = async (): Promise<T[]> => this.execute();

  public first = async (): Promise<T> => {
    const executionRes = await this.execute();
    // TODO add checks for undefined or null
    return executionRes[0];
  };

  protected abstract execute(): Promise<Array<T>>;
}
