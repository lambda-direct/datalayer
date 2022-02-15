/* eslint-disable import/no-cycle */
/* eslint-disable max-len */
import { AbstractColumn, Column } from '../../../columns/column';
import ColumnType from '../../../columns/types/columnType';
import Session from '../../../db/session';
import BuilderError, { BuilderType } from '../../../errors/builderError';
import { DatabaseSelectError } from '../../../errors/dbErrors';
import BaseLogger from '../../../logger/abstractLogger';
import QueryResponseMapper from '../../../mappers/responseMapper';
import { AbstractTable } from '../../../tables';
import { ExtractModel } from '../../../tables/inferTypes';
import Order from '../../highLvlBuilders/order';
import Select from '../../lowLvlBuilders/selects/select';
import Expr from '../../requestBuilders/where/where';
import Join from '../join';
import SelectResponseThreeJoins from '../responses/selectResponseThreeJoins';
import AbstractJoined from './abstractJoinBuilder';
import SelectTRBWithFourJoins from './selectWithFourJoins';

export default class SelectTRBWithThreeJoins<T1, T2, T3, MODEL extends AbstractTable<MODEL>> extends AbstractJoined<MODEL> {
  private _join1: Join<T1>;
  private _join2: Join<T2>;
  private _join3: Join<T3>;

  public constructor(table: MODEL, session: Session,
    filter: Expr, join1: Join<T1>, join2: Join<T2>, join3: Join<T3>,
    columns: { [name in keyof ExtractModel<MODEL>]: AbstractColumn<ColumnType>; },
    props: {limit?:number, offset?:number},
    orderBy?: Column<ColumnType, boolean, boolean>,
    order?: Order,
    logger?: BaseLogger,
    distinct?: AbstractColumn<ColumnType, boolean, boolean>) {
    super(filter, table, session, columns, props, orderBy, order, logger, distinct);
    this._join1 = join1;
    this._join2 = join2;
    this._join3 = join3;
  }

  public join = <T4>(join: Join<T4>):
  SelectTRBWithFourJoins<T1, T2, T3, T4, MODEL> => new SelectTRBWithFourJoins(
    this._table,
    this._session,
    this._filter,
    this._join1,
    this._join2,
    this._join3,
    join,
    this._columns,
    this._props,
    this._orderBy,
    this._order,
    this._logger,
    this._distinct,
  );

  public execute = async (): Promise<SelectResponseThreeJoins<MODEL, T1, T2, T3>> => {
    const queryBuilder = Select
      .from(this._table)
      .joined([{ join: this._join1, id: 1 }, { join: this._join2, id: 2 }, { join: this._join3, id: 3 }])
      .limit(this._props.limit)
      .offset(this._props.offset)
      .filteredBy(this._filter)
      .orderBy(this._orderBy, this._order)
      .distinct(this._distinct);

    let query = '';
    let values = [];
    try {
      const builderResult = queryBuilder.build();
      query = builderResult.query;
      values = builderResult.values;
    } catch (e: any) {
      throw new BuilderError(BuilderType.JOINED_SELECT,
        this._tableName, Object.values(this._columns), e, this._filter);
    }

    if (this._logger) {
      this._logger.info(`Selecting from ${this._tableName} using query:\n ${query}`);
    }

    const parent:
    { [name in keyof ExtractModel<T1>]: AbstractColumn<ColumnType>; } = this._join1.mappedServiceToDb;
    const parentTwo:
    { [name in keyof ExtractModel<T2>]: AbstractColumn<ColumnType>; } = this._join2.mappedServiceToDb;
    const parentThree:
    { [name in keyof ExtractModel<T3>]: AbstractColumn<ColumnType>; } = this._join3.mappedServiceToDb;

    const result = await this._session.execute(query, values);
    if (result.isLeft()) {
      const { reason } = result.value;
      throw new DatabaseSelectError(this._tableName, reason, query);
    } else {
      const response = QueryResponseMapper.map(this._columns, result.value);
      const objects = QueryResponseMapper.map(parent, result.value, 1);
      const objectsTwo = QueryResponseMapper.map(parentTwo, result.value, 2);
      const objectsThree = QueryResponseMapper.map(parentThree, result.value, 3);

      return new SelectResponseThreeJoins(response, objects, objectsTwo, objectsThree);
    }
  };
}
