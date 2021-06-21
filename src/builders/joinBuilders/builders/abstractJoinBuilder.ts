import { Pool } from 'pg';
import Expr from '../../requestBuilders/where/where';

export default abstract class AbstractJoined {
  protected _tableName: string;
  protected _pool: Pool;
  protected _filter: Expr;

  public constructor(filter: Expr, tableName: string, pool: Pool) {
    this._tableName = tableName;
    this._pool = pool;
    this._filter = filter;
  }
}
