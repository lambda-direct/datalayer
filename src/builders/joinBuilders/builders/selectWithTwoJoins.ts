import { Column } from '../../../columns/column';
import ColumnType from '../../../columns/types/columnType';
import Session from '../../../db/session';
import BuilderError, { BuilderType } from '../../../errors/builderError';
import { DatabaseSelectError } from '../../../errors/dbErrors';
import QueryResponseMapper from '../../../mappers/responseMapper';
import { ExtractModel } from '../../../tables/inferTypes';
import Select from '../../lowLvlBuilders/selects/select';
import Expr from '../../requestBuilders/where/where';
import Join from '../join';
import SelectResponseTwoJoins from '../responses/selectResponseTwoJoins';
import AbstractJoined from './abstractJoinBuilder';
import SelectTRBWithThreeJoins from './selectWithThreeJoins';

export default class SelectTRBWithTwoJoins<COLUMN extends
ColumnType, T1, T2, MODEL> extends AbstractJoined<MODEL> {
  private _join1: Join<COLUMN, T1>;
  private _join2: Join<COLUMN, T2>;

  public constructor(tableName: string, session: Session,
    filter: Expr, join1: Join<COLUMN, T1>, join2: Join<COLUMN, T2>,
    columns: { [name in keyof ExtractModel<MODEL>]: Column<ColumnType>; }) {
    super(filter, tableName, session, columns);
    this._join1 = join1;
    this._join2 = join2;
  }

  public join = <T3>(join: Join<COLUMN, T3>):
  SelectTRBWithThreeJoins<COLUMN, T1, T2, T3, MODEL> => new SelectTRBWithThreeJoins(
    this._tableName,
    this._session,
    this._filter,
    this._join1,
    this._join2,
    join,
    this._columns,
  );

  public execute = async (): Promise<SelectResponseTwoJoins<MODEL, T1, T2>> => {
    const queryBuilder = Select.from(this._tableName, Object.values(this._columns));
    if (this._filter) {
      queryBuilder.filteredBy(this._filter);
    }

    queryBuilder.joined([this._join1, this._join2]);

    let query = '';
    try {
      query = queryBuilder.build();
    } catch (e) {
      throw new BuilderError(BuilderType.TWO_JOINED_SELECT,
        this._tableName, Object.values(this._columns), e, this._filter);
    }

    const parent:
    { [name in keyof ExtractModel<T1>]: Column<ColumnType>; } = this._join1.mappedServiceToDb;
    const parentTwo:
    { [name in keyof ExtractModel<T2>]: Column<ColumnType>; } = this._join2.mappedServiceToDb;

    const result = await this._session.execute(query);
    if (result.isLeft()) {
      const { reason } = result.value;
      throw new DatabaseSelectError(this._tableName, reason, query);
    } else {
      const response = QueryResponseMapper.map(this._columns, result.value);
      const objects = QueryResponseMapper.map(parent, result.value);
      const objectsTwo = QueryResponseMapper.map(parentTwo, result.value);

      return new SelectResponseTwoJoins(response, objects, objectsTwo);
    }
  };
}
