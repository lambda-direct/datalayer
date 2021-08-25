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
import SelectResponseFourJoins from '../responses/selectResponseFourJoins';
import AbstractJoined from './abstractJoinBuilder';

export default class SelectTRBWithFourJoins<COLUMN extends
ColumnType, T1, T2, T3, T4, MODEL> extends AbstractJoined<MODEL> {
  private _join1: Join<COLUMN, T1>;
  private _join2: Join<COLUMN, T2>;
  private _join3: Join<COLUMN, T3>;
  private _join4: Join<COLUMN, T4>;

  public constructor(tableName: string, session: Session,
    filter: Expr, join1: Join<COLUMN, T1>, join2: Join<COLUMN, T2>, join3: Join<COLUMN, T3>,
    join4: Join<COLUMN, T4>,
    columns: { [name in keyof ExtractModel<MODEL>]: Column<ColumnType>; }) {
    super(filter, tableName, session, columns);
    this._join1 = join1;
    this._join2 = join2;
    this._join3 = join3;
    this._join4 = join4;
  }

  public execute = async (): Promise<SelectResponseFourJoins<MODEL, T1, T2, T3, T4>> => {
    const queryBuilder = Select.from(this._tableName, Object.values(this._columns));
    if (this._filter) {
      queryBuilder.filteredBy(this._filter);
    }

    queryBuilder.joined([this._join1, this._join2, this._join3, this._join4]);

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
    const parentThree:
    { [name in keyof ExtractModel<T3>]: Column<ColumnType>; } = this._join3.mappedServiceToDb;
    const parentFour:
    { [name in keyof ExtractModel<T4>]: Column<ColumnType>; } = this._join4.mappedServiceToDb;

    const result = await this._session.execute(query);
    if (result.isLeft()) {
      const { reason } = result.value;
      throw new DatabaseSelectError(this._tableName, reason, query);
    } else {
      const response = QueryResponseMapper.map(this._columns, result.value);
      const objects = QueryResponseMapper.map(parent, result.value);
      const objectsTwo = QueryResponseMapper.map(parentTwo, result.value);
      const objectsThree = QueryResponseMapper.map(parentThree, result.value);
      const objectsFour = QueryResponseMapper.map(parentFour, result.value);

      return new SelectResponseFourJoins(response, objects, objectsTwo, objectsThree, objectsFour);
    }
  };
}