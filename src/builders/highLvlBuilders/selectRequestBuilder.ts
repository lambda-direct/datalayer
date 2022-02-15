/* eslint-disable import/no-cycle */
import { Select } from '..';
import { AbstractColumn, Column } from '../../columns/column';
import ColumnType from '../../columns/types/columnType';
import Session from '../../db/session';
import BuilderError, { BuilderType } from '../../errors/builderError';
import { DatabaseSelectError } from '../../errors/dbErrors';
import BaseLogger from '../../logger/abstractLogger';
import QueryResponseMapper from '../../mappers/responseMapper';
import { AbstractTable } from '../../tables';
import { ExtractModel } from '../../tables/inferTypes';
import SelectTRBWithJoin from '../joinBuilders/builders/selectWithJoin';
import Join from '../joinBuilders/join';
import Expr from '../requestBuilders/where/where';
import TableRequestBuilder from './abstractRequestBuilder';
import Order from './order';

export default class SelectTRB<TTable extends AbstractTable<TTable>>
  extends TableRequestBuilder<TTable> {
  protected _filter: Expr;
  private props: {limit?:number, offset?:number};
  private __orderBy?: Column<ColumnType, boolean, boolean>;
  private __groupBy?: Column<ColumnType, boolean, boolean>;
  private __order?: Order;
  private __distinct: AbstractColumn<ColumnType, boolean, boolean>;

  public constructor(
    table: AbstractTable<TTable>,
    session: Session,
    mappedServiceToDb: { [name in keyof ExtractModel<TTable>]: AbstractColumn<ColumnType>; },
    props: {limit?:number, offset?:number},
    logger?: BaseLogger,
  ) {
    super(table, session, mappedServiceToDb, logger);
    this.props = props;
  }

  public where = (expr: Expr): SelectTRB<TTable> => {
    this._filter = expr;
    return this;
  };

  public distinct = (column: AbstractColumn<ColumnType<any>, boolean, boolean>)
  : SelectTRB<TTable> => {
    this.__distinct = column;
    return this;
  };

  public orderBy(callback: (table: TTable) => Column<ColumnType, boolean, boolean>, order: Order)
    : SelectTRB<TTable> {
    this.__orderBy = callback(this._table);
    this.__order = order;
    return this;
  }

  // public groupBy(callback: (table: TTable) => Column<ColumnType, boolean, boolean>)
  //   : SelectTRB<TTable> {
  //   this.__groupBy = callback(this.__table);
  //   return this;
  // }

  public join = <T1 extends AbstractTable<T1>>(join: Join<T1>):
  SelectTRBWithJoin<T1, TTable> => new SelectTRBWithJoin(this._table, this._session,
    this._filter, join, this._mappedServiceToDb, this.props, this.__orderBy, this.__order,
    this._logger, this.__distinct);

  public execute = async () => {
    const res = await this._execute();
    return res;
  };

  protected _execute = async (): Promise<ExtractModel<TTable>[]> => {
    // Select.from().filteredBy().limit().offset().orderBy().groupBy().build()
    const queryBuilder = Select
      .from(this._table)
      .filteredBy(this._filter)
      .limit(this.props.limit)
      .offset(this.props.offset)
      .orderBy(this.__orderBy, this.__order)
      .distinct(this.__distinct);

    let query = '';
    let values = [];
    try {
      const builderResult = queryBuilder.build();
      query = builderResult.query;
      values = builderResult.values;
    } catch (e: any) {
      throw new BuilderError(BuilderType.SELECT, this._tableName,
        this._columns, e, this._filter);
    }

    if (this._logger) {
      this._logger.info(`Selecting from ${this._tableName} using query:\n ${query}`);
    }

    const result = await this._session.execute(query, values);
    if (result.isLeft()) {
      const { reason } = result.value;
      throw new DatabaseSelectError(this._tableName, reason, query);
    } else {
      return QueryResponseMapper.map(this._mappedServiceToDb, result.value);
    }
  };
}
