import { Pool } from 'pg';
import Column from '../../columns/column';
import ColumnType from '../../columns/types/columnType';
import QueryResponseMapper from '../../mappers/responseMapper';
import Delete from '../lowLvlBuilders/delets/delete';
import Expr from '../requestBuilders/where/where';
import TableRequestBuilder from './abstractRequestBuilder';

export default class DeleteTRB<T> extends TableRequestBuilder<T> {
  private _filter: Expr;

  public constructor(
    tableName: string,
    pool: Pool,
    mappedServiceToDb: { [name in keyof T]: Column<ColumnType, {}>; },
    columns: Column<ColumnType, {}>[],
  ) {
    super(tableName, pool, mappedServiceToDb, columns);
  }

  public where = (expr: Expr): DeleteTRB<T> => {
    this._filter = expr;
    return this;
  };

  public returningAll = async () => this.execute();

  protected execute = async (): Promise<T[]> => {
    const queryBuilder = Delete.from(this._tableName);
    if (this._filter) {
      queryBuilder.filteredBy(this._filter);
    }

    const query = queryBuilder.build();

    const result = await this._pool.query(query);
    return QueryResponseMapper.map(this._mappedServiceToDb, result);
  };
}
