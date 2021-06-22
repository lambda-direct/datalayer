import { Pool } from 'pg';
import Column from '../../../columns/column';
import ColumnType from '../../../columns/types/columnType';
import QueryResponseMapper from '../../../mappers/responseMapper';
import Select from '../../lowLvlBuilders/selects/select';
import Expr from '../../requestBuilders/where/where';
import Join from '../join';
import SelectResponseJoin from '../responses/selectResponseWithJoin';
import AbstractJoined from './abstractJoinBuilder';
import SelectTRBWithTwoJoins from './selectWithTwoJoins';

export default class SelectTRBWithJoin<COLUMN extends ColumnType, T1, MODEL>
  extends AbstractJoined<MODEL> {
  private _join: Join<COLUMN, T1>;

  public constructor(tableName: string, pool: Pool,
    filter: Expr,
    join: Join<COLUMN, T1>,
    columns: { [name in keyof MODEL]: Column<ColumnType, {}>; }) {
    super(filter, tableName, pool, columns);
    this._join = join;
  }

  public join = <T2>(join: Join<COLUMN, T2>):
  SelectTRBWithTwoJoins<COLUMN, T1, T2, MODEL> => new SelectTRBWithTwoJoins(this._tableName,
    this._pool, this._filter, this._join, join, this._columns);

  public execute = async (): Promise<SelectResponseJoin<MODEL, T1>> => {
    const queryBuilder = Select.from(this._tableName, Object.values(this._columns));
    if (this._filter) {
      queryBuilder.filteredBy(this._filter);
    }

    queryBuilder.joined([this._join]);

    const query = queryBuilder.build();

    const result = await this._pool!.query(query);

    const parent:{ [name in keyof T1]: Column<ColumnType, {}>; } = this._join.mappedServiceToDb;

    const response = QueryResponseMapper.map(this._columns, result);
    const objects = QueryResponseMapper.map(parent, result);

    return new SelectResponseJoin(response, objects);
  };
}
