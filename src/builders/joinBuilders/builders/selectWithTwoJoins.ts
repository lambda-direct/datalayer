import { Pool } from 'pg';
import Column from '../../../columns/column';
import ColumnType from '../../../columns/types/columnType';
import QueryResponseMapper from '../../../mappers/responseMapper';
import Select from '../../lowLvlBuilders/selects/select';
import Expr from '../../requestBuilders/where/where';
import Join from '../join';
import SelectResponseTwoJoins from '../responses/selectResponseTwoJoins';
import AbstractJoined from './abstractJoinBuilder';

export default class SelectTRBWithTwoJoins<COLUMN extends
ColumnType, T1, T2, MODEL> extends AbstractJoined<MODEL> {
  private _join1: Join<COLUMN, T1>;
  private _join2: Join<COLUMN, T2>;

  public constructor(tableName: string, pool: Pool,
    filter: Expr, join1: Join<COLUMN, T1>, join2: Join<COLUMN, T2>,
    columns: { [name in keyof MODEL]: Column<ColumnType, {}>; }) {
    super(filter, tableName, pool, columns);
    this._join1 = join1;
    this._join2 = join2;
  }

  public execute = async (): Promise<SelectResponseTwoJoins<MODEL, T1, T2>> => {
    // List<Join<T, ?>> joinPropsList = Arrays.asList(join1, join2);

    const queryBuilder = Select.from(this._tableName, Object.values(this._columns));
    if (this._filter) {
      queryBuilder.filteredBy(this._filter);
    }

    queryBuilder.joined([this._join1, this._join2]);

    const query = queryBuilder.build();

    const result = await this._pool!.query(query);

    const parent:{ [name in keyof T1]: Column<ColumnType, {}>; } = this._join1.mappedServiceToDb;
    const parentTwo:{ [name in keyof T2]: Column<ColumnType, {}>; } = this._join2.mappedServiceToDb;

    const response = QueryResponseMapper.map(this._columns, result);
    const objects = QueryResponseMapper.map(parent, result);
    const objectsTwo = QueryResponseMapper.map(parentTwo, result);

    return new SelectResponseTwoJoins(response, objects, objectsTwo);
  };
}
