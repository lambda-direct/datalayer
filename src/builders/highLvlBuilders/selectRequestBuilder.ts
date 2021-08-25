/* eslint-disable max-classes-per-file */
import { JoinWith, Select } from '..';
import { Column } from '../../columns/column';
import ColumnType from '../../columns/types/columnType';
import { IDB, StubDB } from '../../db/db';
import Session from '../../db/session';
import BuilderError, { BuilderType } from '../../errors/builderError';
import { DatabaseSelectError } from '../../errors/dbErrors';
import BaseLogger from '../../logger/abstractLogger';
import QueryResponseMapper from '../../mappers/responseMapper';
import { AbstractTable } from '../../tables';
import { AnyColumn, ExtractModel } from '../../tables/inferTypes';
import SelectTRBWithJoin from '../joinBuilders/builders/selectWithJoin';
import { JoinStrategy } from '../joinBuilders/join';
import Expr from '../requestBuilders/where/where';
import TableRequestBuilder from './abstractRequestBuilder';
import Order from './order';

export default class SelectTRB<TTable>
  extends TableRequestBuilder<TTable> {
  protected _filter: Expr;
  private props: {limit?:number, offset?:number};
  private __orderBy?: Column<ColumnType, boolean, boolean>;
  private __groupBy?: Column<ColumnType, boolean, boolean>;
  private __order?: Order;
  private __table: TTable;

  public constructor(
    tableName: string,
    session: Session,
    mappedServiceToDb: { [name in keyof ExtractModel<TTable>]: Column<ColumnType>; },
    logger: BaseLogger,
    props: {limit?:number, offset?:number},
    table: AbstractTable<TTable>,
  ) {
    super(tableName, session, mappedServiceToDb, logger);
    this.props = props;
    this.__table = table as unknown as TTable;
  }

  public where = (expr: Expr): SelectTRB<TTable> => {
    this._filter = expr;
    return this;
  };

  public orderBy(callback: (table: TTable) => Column<ColumnType, boolean, boolean>, order: Order)
    : SelectTRB<TTable> {
    this.__orderBy = callback(this.__table);
    this.__order = order;
    return this;
  }

  // public groupBy(callback: (table: TTable) => Column<ColumnType, boolean, boolean>)
  //   : SelectTRB<TTable> {
  //   this.__groupBy = callback(this.__table);
  //   return this;
  // }

  public innerJoin<IToTable extends AbstractTable<IToTable>>(
    table: { new(db: IDB): IToTable ;},
    from: (table: TTable) => AnyColumn,
    to: (table: IToTable) => AnyColumn,
  ) {
    const fromColumn = from(this.__table);
    // eslint-disable-next-line new-cap
    const toColumn = to(new table(new StubDB()));

    const join = new JoinWith(this._tableName, this._mappedServiceToDb)
      .columns(fromColumn, toColumn).joinStrategy(JoinStrategy.INNER_JOIN);

    return new SelectTRBWithJoin(this._tableName, this._session,
      this._filter, join, this._mappedServiceToDb);
  }

  public leftJoin<IToTable extends AbstractTable<IToTable>>(
    table: { new(db: IDB): IToTable ;},
    from: (table: TTable) => AnyColumn,
    to: (table: IToTable) => AnyColumn,
  ) {
    const fromColumn = from(this.__table);
    // eslint-disable-next-line new-cap
    const toColumn = to(new table(new StubDB()));

    const join = new JoinWith(this._tableName, this._mappedServiceToDb)
      .columns(fromColumn, toColumn).joinStrategy(JoinStrategy.LEFT_JOIN);

    return new SelectTRBWithJoin(this._tableName, this._session,
      this._filter, join, this._mappedServiceToDb);
  }

  public rightJoin<IToTable extends AbstractTable<IToTable>>(
    table: { new(db: IDB): IToTable ;},
    from: (table: TTable) => AnyColumn,
    to: (table: IToTable) => AnyColumn,
  ) {
    const fromColumn = from(this.__table);
    // eslint-disable-next-line new-cap
    const toColumn = to(new table(new StubDB()));

    const join = new JoinWith(this._tableName, this._mappedServiceToDb)
      .columns(fromColumn, toColumn).joinStrategy(JoinStrategy.RIGHT_JOIN);

    return new SelectTRBWithJoin(this._tableName, this._session,
      this._filter, join, this._mappedServiceToDb);
  }

  public fullJoin<IToTable extends AbstractTable<IToTable>>(
    table: { new(db: IDB): IToTable ;},
    from: (table: TTable) => AnyColumn,
    to: (table: IToTable) => AnyColumn,
  ) {
    const fromColumn = from(this.__table);
    // eslint-disable-next-line new-cap
    const toColumn = to(new table(new StubDB()));

    const join = new JoinWith(this._tableName, this._mappedServiceToDb)
      .columns(fromColumn, toColumn).joinStrategy(JoinStrategy.FULL_JOIN);

    return new SelectTRBWithJoin(this._tableName, this._session,
      this._filter, join, this._mappedServiceToDb);
  }

  // public join = <COLUMN extends ColumnType, T1>(join: Join<COLUMN, T1>):
  // SelectTRBWithJoin<COLUMN, T1, TTable> => new SelectTRBWithJoin(this._tableName, this._session,
  //   this._filter, join, this._mappedServiceToDb);

  public execute = async () => {
    const res = await this._execute();
    return res;
  };

  protected _execute = async (): Promise<ExtractModel<TTable>[]> => {
    // Select.from().filteredBy().limit().offset().orderBy().groupBy().build()
    const queryBuilder = Select.from(this._tableName, this._columns);
    if (this._filter) {
      queryBuilder.filteredBy(this._filter);
    }
    if (this.props.limit) {
      queryBuilder.limit(this.props.limit);
    }
    if (this.props.offset) {
      queryBuilder.offset(this.props.offset);
    }
    if (this.__orderBy) {
      queryBuilder.orderBy(this.__orderBy, this.__order!);
    }

    let query = '';
    try {
      query = queryBuilder.build();
    } catch (e) {
      throw new BuilderError(BuilderType.SELECT, this._tableName, this._columns, e, this._filter);
    }

    if (this._logger) {
      this._logger.info(`Selecting from ${this._tableName} using query:\n ${query}`);
    }

    const result = await this._session.execute(query);
    if (result.isLeft()) {
      const { reason } = result.value;
      throw new DatabaseSelectError(this._tableName, reason, query);
    } else {
      return QueryResponseMapper.map(this._mappedServiceToDb, result.value);
    }
  };
}
