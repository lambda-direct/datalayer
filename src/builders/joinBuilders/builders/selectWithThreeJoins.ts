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
import SelectResponseThreeJoins from '../responses/selectResponseThreeJoins';
import AbstractJoined from './abstractJoinBuilder';
import SelectTRBWithFourJoins from './selectWithFourJoins';

export default class SelectTRBWithThreeJoins<COLUMN extends
ColumnType, T1, T2, T3, MODEL> extends AbstractJoined<MODEL> {
  private _join1: Join<COLUMN, T1>;
  private _join2: Join<COLUMN, T2>;
  private _join3: Join<COLUMN, T3>;

  public constructor(tableName: string, session: Session,
    filter: Expr, join1: Join<COLUMN, T1>, join2: Join<COLUMN, T2>, join3: Join<COLUMN, T3>,
    columns: { [name in keyof ExtractModel<MODEL>]: Column<ColumnType>; },
    props: {limit?:number, offset?:number}) {
    super(filter, tableName, session, columns, props);
    this._join1 = join1;
    this._join2 = join2;
    this._join3 = join3;
  }

  public join = <T4>(join: Join<COLUMN, T4>):
  SelectTRBWithFourJoins<COLUMN, T1, T2, T3, T4, MODEL> => new SelectTRBWithFourJoins(
    this._tableName,
    this._session,
    this._filter,
    this._join1,
    this._join2,
    this._join3,
    join,
    this._columns,
    this._props,
  );

  public execute = async (): Promise<SelectResponseThreeJoins<MODEL, T1, T2, T3>> => {
    const queryBuilder = Select
      .from(this._tableName, Object.values(this._columns))
      .joined([this._join1, this._join2, this._join3])
      .filteredBy(this._filter);

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

    const result = await this._session.execute(query);
    if (result.isLeft()) {
      const { reason } = result.value;
      throw new DatabaseSelectError(this._tableName, reason, query);
    } else {
      const response = QueryResponseMapper.map(this._columns, result.value);
      const objects = QueryResponseMapper.map(parent, result.value);
      const objectsTwo = QueryResponseMapper.map(parentTwo, result.value);
      const objectsThree = QueryResponseMapper.map(parentThree, result.value);

      return new SelectResponseThreeJoins(response, objects, objectsTwo, objectsThree);
    }
  };
}
