import { Pool } from 'pg';
import ColumnType from '../../../columns/types/columnType';
import QueryResponseMapper from '../../../mappers/responseMapper';
import AbstractTable from '../../../tables/abstractTable';
import Select from '../../lowLvlBuilders/selects/select';
import { Expr } from '../../requestBuilders/where';
import Join from '../join';
import SelectResponseJoin from '../responses/SelectResponseWithJoin';
import AbstractJoined from './abstractJoinBuilder';
import SelectTRBWithTwoJoins from './selectWithTwoJoins';

export default class SelectTRBWithJoin<COLUMN extends ColumnType, T1, MODEL>
  extends AbstractJoined<MODEL> {
  private _join: Join<COLUMN, T1>;

  public constructor(table: AbstractTable<MODEL>, pool: Pool,
    filter: Expr, join: Join<COLUMN, T1>) {
    super(filter, table, pool);
    this._join = join;
  }

  public join = <T2>(join: Join<COLUMN, T2>):
  SelectTRBWithTwoJoins<COLUMN, T1, T2, MODEL> => new SelectTRBWithTwoJoins(this._table,
    this._pool, this._filter, this._join, join);

  public execute = async (): Promise<SelectResponseJoin<MODEL, T1>> => {
    const queryBuilder = Select.from(this._table);
    if (this._filter) {
      queryBuilder.filteredBy(this._filter);
    }

    queryBuilder.joined([this._join]);

    const query = queryBuilder.build();

    const result = await this._pool!.query(query);

    const parent: AbstractTable<T1> = this._join.joinTable;

    const response = QueryResponseMapper.map(this._table, result);
    const objects = QueryResponseMapper.map(parent, result);

    return new SelectResponseJoin(response, objects);
  };
}
