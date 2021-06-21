import { Pool } from 'pg';
import AbstractTable from '../../../tables/abstractTable';
import { Expr } from '../../requestBuilders/where/where';

export default abstract class AbstractJoined<MODEL> {
  protected _table: AbstractTable<MODEL>;
  protected _pool: Pool;
  protected _filter: Expr;

  public constructor(filter: Expr, table: AbstractTable<MODEL>, pool: Pool) {
    this._table = table;
    this._pool = pool;
    this._filter = filter;
  }
}
