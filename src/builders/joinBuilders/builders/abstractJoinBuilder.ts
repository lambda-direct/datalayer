import { Pool } from 'pg';
import Column from '../../../columns/column';
import ColumnType from '../../../columns/types/columnType';
import Expr from '../../requestBuilders/where/where';

export default abstract class AbstractJoined<K> {
  protected _tableName: string;
  protected _pool: Pool;
  protected _filter: Expr;
  protected _columns: { [name in keyof K]: Column<ColumnType, {}>; };

  public constructor(filter: Expr,
    tableName: string,
    pool: Pool,
    columns: { [name in keyof K]: Column<ColumnType, {}>; }) {
    this._tableName = tableName;
    this._pool = pool;
    this._filter = filter;
    this._columns = columns;
  }
}
