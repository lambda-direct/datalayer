import { Pool } from 'pg';

export default class Transaction {
  private pool: Pool;

  public constructor(pool: Pool) {
    this.pool = pool;
  }

  public begin = async (): Promise<Transaction> => {
    await this.pool.query('BEGIN;');
    return this;
  };

  public commit = async (): Promise<Transaction> => {
    await this.pool.query('COMMIT;');
    return this;
  };

  public rollback = async (): Promise<Transaction> => {
    await this.pool.query('ROLLBACK;');
    return this;
  };
}
