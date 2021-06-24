import { Pool } from 'pg';
import AbstractTable from '../tables/abstractTable';

export default class Db {
  public _pool: Pool;

  public constructor(pool: Pool) {
    this._pool = pool;
  }

  public use = <T extends AbstractTable<{}>>(table: T): void => {
    table.withConnection(this._pool);
  };
}
