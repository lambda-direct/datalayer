import { Pool } from 'pg';
import QueryResponseMapper from '../../mappers/responseMapper';
import AbstractTable from '../../tables/abstractTable';
import Update from '../lowLvlBuilders/updates/update';
import UpdateExpr from '../requestBuilders/updates/updates';
import Expr from '../requestBuilders/where/where';
import TableRequestBuilder from './abstractRequestBuilder';

export default class UpdateTRB<T> extends TableRequestBuilder<T> {
  private _filter: Expr;
  private _update: UpdateExpr;

  public constructor(table: AbstractTable<T>, pool: Pool) {
    super(table, pool);
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
    const query: string = Update.in(this._table).set(this._update).filteredBy(this._filter).build();

    const result = await this._pool.query(query);
    return QueryResponseMapper.map(this._table, result);
  };
}
