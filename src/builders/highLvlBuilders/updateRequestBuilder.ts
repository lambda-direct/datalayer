import { Pool } from 'pg';
import Column from '../../columns/column';
import ColumnType from '../../columns/types/columnType';
import QueryResponseMapper from '../../mappers/responseMapper';
import Update from '../lowLvlBuilders/updates/update';
import UpdateExpr from '../requestBuilders/updates/updates';
import Expr from '../requestBuilders/where/where';
import TableRequestBuilder from './abstractRequestBuilder';

export default class UpdateTRB<T> extends TableRequestBuilder<T> {
  private _filter: Expr;
  private _update: UpdateExpr;

  public constructor(
    tableName: string,
    pool: Pool,
    mappedServiceToDb: { [name in keyof T]: Column<ColumnType, {}>; },
    columns: Column<ColumnType, {}>[],
  ) {
    super(tableName, pool, mappedServiceToDb, columns);
  }

  public where = (expr: Expr): UpdateTRB<T> => {
    this._filter = expr;
    return this;
  };

  public set = (expr: UpdateExpr): UpdateTRB<T> => {
    this._update = expr;
    return this;
  };

  public execute = async (): Promise<T[]> => {
    const query: string = Update.in(this._tableName)
      .columns(this._columns)
      .set(this._update).filteredBy(this._filter)
      .build();

    const result = await this._pool.query(query);
    return QueryResponseMapper.map(this._mappedServiceToDb, result);
  };
}
