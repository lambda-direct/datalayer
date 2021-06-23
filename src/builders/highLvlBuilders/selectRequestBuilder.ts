import { Pool } from 'pg';
import Column from '../../columns/column';
import ColumnType from '../../columns/types/columnType';
import QueryResponseMapper from '../../mappers/responseMapper';
import SelectTRBWithJoin from '../joinBuilders/builders/selectWithJoin';
import Join from '../joinBuilders/join';
import Select from '../lowLvlBuilders/selects/select';
import Expr from '../requestBuilders/where/where';
import TableRequestBuilder from './abstractRequestBuilder';

export default class SelectTRB<T> extends TableRequestBuilder<T> {
  protected _filter: Expr;

  public constructor(
    tableName: string,
    pool: Pool,
    mappedServiceToDb: { [name in keyof T]: Column<ColumnType, {}>; },
    columns: Column<ColumnType, {}>[],
  ) {
    super(tableName, pool, mappedServiceToDb, columns);
  }

  public where = (expr: Expr): SelectTRB<T> => {
    this._filter = expr;
    return this;
  };

  public join = <COLUMN extends ColumnType, T1>(join: Join<COLUMN, T1>):
  SelectTRBWithJoin<COLUMN, T1,
  T> => new SelectTRBWithJoin(this._tableName, this._pool,
    this._filter, join, this._mappedServiceToDb);
  // if (join.toColumn.getParent() === this._table) {
  //   throw Error('We are not supporting self joining in this version');
  // }

  public execute = async (): Promise<T[]> => {
    const queryBuilder = Select.from(this._tableName, this._columns);
    if (this._filter) {
      queryBuilder.filteredBy(this._filter);
    }

    const query = queryBuilder.build();
    // TODO Add logger true/false for sql query logging?
    console.log(query);

    const result = await this._pool!.query(query);
    return QueryResponseMapper.map(this._mappedServiceToDb, result);
  };
}
