import { AbstractColumn, Column } from '../../../columns/column';
import ColumnType from '../../../columns/types/columnType';
import Session from '../../../db/session';
import BuilderError, { BuilderType } from '../../../errors/builderError';
import { DatabaseSelectError } from '../../../errors/dbErrors';
import BaseLogger from '../../../logger/abstractLogger';
import QueryResponseMapper from '../../../mappers/responseMapper';
import { ExtractModel } from '../../../tables/inferTypes';
import Order from '../../highLvlBuilders/order';
import Select from '../../lowLvlBuilders/selects/select';
import Expr from '../../requestBuilders/where/where';
import Join from '../join';
import SelectResponseJoin from '../responses/selectResponseWithJoin';
import AbstractJoined from './abstractJoinBuilder';
import SelectTRBWithTwoJoins from './selectWithTwoJoins';

export default class SelectTRBWithJoin<COLUMN extends ColumnType, T1, MODEL>
  extends AbstractJoined<MODEL> {
  private _join: Join<COLUMN, T1>;

  public constructor(tableName: string, session: Session,
    filter: Expr,
    join: Join<COLUMN, T1>,
    columns: { [name in keyof ExtractModel<MODEL>]: Column<ColumnType>; },
    props: {limit?:number, offset?:number},
    orderBy?: Column<ColumnType, boolean, boolean>,
    order?: Order,
    logger?: BaseLogger,
    distinct?: AbstractColumn<ColumnType, boolean, boolean>) {
    super(filter, tableName, session, columns, props, orderBy, order, logger, distinct);
    this._join = join;
  }

  public join = <T2>(join: Join<COLUMN, T2>):
  SelectTRBWithTwoJoins<COLUMN, T1, T2, MODEL> => new SelectTRBWithTwoJoins(
    this._tableName,
    this._session,
    this._filter,
    this._join,
    join,
    this._columns,
    this._props,
    this._orderBy,
    this._order,
    this._logger,
    this._distinct,
  );

  public execute = async (): Promise<SelectResponseJoin<MODEL, T1>> => {
    const queryBuilder = Select
      .from(this._tableName, Object.values(this._columns))
      .joined([this._join])
      .limit(this._props.limit)
      .offset(this._props.offset)
      .filteredBy(this._filter)
      .orderBy(this._orderBy, this._order)
      .distinct(this._distinct);

    let query = '';
    try {
      query = queryBuilder.build();
    } catch (e) {
      throw new BuilderError(BuilderType.JOINED_SELECT,
        this._tableName, Object.values(this._columns), e, this._filter);
    }

    if (this._logger) {
      this._logger.info(`Selecting from ${this._tableName} using query:\n ${query}`);
    }

    const parent:
    { [name in keyof ExtractModel<T1>]
      : AbstractColumn<ColumnType>; } = this._join.mappedServiceToDb;

    const result = await this._session.execute(query);
    if (result.isLeft()) {
      const { reason } = result.value;
      throw new DatabaseSelectError(this._tableName, reason, query);
    } else {
      const response = QueryResponseMapper.map(this._columns, result.value);
      const objects = QueryResponseMapper.map(parent, result.value);

      return new SelectResponseJoin(response, objects);
    }
  };
}
