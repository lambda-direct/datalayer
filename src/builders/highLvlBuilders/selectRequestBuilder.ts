import { Pool } from 'pg';
import ColumnType from '../../columns/types/columnType';
import QueryResponseMapper from '../../mappers/responseMapper';
import AbstractTable from '../../tables/abstractTable';
import { SelectTRBWithJoin } from '../joinBuilders';
import Join from '../joinBuilders/join';
import Select from '../lowLvlBuilders/selects/select';
import Expr from '../requestBuilders/where/where';
import TableRequestBuilder from './abstractRequestBuilder';

export default class SelectTRB<MODEL> extends TableRequestBuilder<MODEL> {
  protected _filter: Expr;

  public constructor(table: AbstractTable<MODEL>, pool: Pool) {
    super(table, pool);
  }

  public where = (expr: Expr): SelectTRB<MODEL> => {
    this._filter = expr;
    return this;
  };

  public join = <COLUMN extends ColumnType, T1>(join: Join<COLUMN, T1>):
  SelectTRBWithJoin<COLUMN, T1,
  MODEL> => new SelectTRBWithJoin(this._table, this._pool, this._filter, join);
  // if (join.toColumn.getParent() === this._table) {
  //   throw Error('We are not supporting self joining in this version');
  // }

  public execute = async (): Promise<MODEL[]> => {
    const queryBuilder = Select.from(this._table);
    if (this._filter) {
      queryBuilder.filteredBy(this._filter);
    }

    const query = queryBuilder.build();
    // TODO Add logger true/false for sql query logging?

    const result = await this._pool!.query(query);
    return QueryResponseMapper.map(this._table, result);
  };
}
