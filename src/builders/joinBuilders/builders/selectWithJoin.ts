import { Column } from '../../../columns/column';
import ColumnType from '../../../columns/types/columnType';
import { IDB, StubDB } from '../../../db/db';
import Session from '../../../db/session';
import BuilderError, { BuilderType } from '../../../errors/builderError';
import { DatabaseSelectError } from '../../../errors/dbErrors';
import QueryResponseMapper from '../../../mappers/responseMapper';
import AbstractTable from '../../../tables/abstractTable';
import { AnyColumn, ExtractModel } from '../../../tables/inferTypes';
import Select from '../../lowLvlBuilders/selects/select';
import Expr from '../../requestBuilders/where/where';
import Join, { JoinStrategy } from '../join';
import JoinWith from '../joinWith';
import SelectResponseJoin from '../responses/selectResponseWithJoin';
import AbstractJoined from './abstractJoinBuilder';
import SelectTRBWithTwoJoins from './selectWithTwoJoins';

export default class SelectTRBWithJoin<COLUMN extends ColumnType, T1, MODEL, TTable>
  extends AbstractJoined<MODEL, TTable> {
  private table: AbstractTable<TTable>;
  private _join: Join<COLUMN, T1>;

  public constructor(tableName: string, session: Session,
    filter: Expr,
    join: Join<COLUMN, T1>,
    columns: { [name in keyof ExtractModel<MODEL>]: Column<ColumnType>; },
    table: AbstractTable<TTable>) {
    super(filter, tableName, session, columns, table);
    this._join = join;
  }

  public innerJoin<IToTable extends AbstractTable<IToTable>>(
    table: { new(db: IDB): IToTable ;},
    from: (table: TTable) => AnyColumn,
    to: (table: IToTable) => AnyColumn,
  ) {
    const fromColumn = from(this._table);
    // eslint-disable-next-line new-cap
    const toColumn = to(new table(new StubDB()));

    const join = new JoinWith(this._tableName, this._columns)
      .columns(fromColumn, toColumn).joinStrategy(JoinStrategy.INNER_JOIN);

    return new SelectTRBWithJoin(this._tableName, this._session,
      this._filter, join, this._columns);
  }

  public leftJoin<IToTable extends AbstractTable<IToTable>>(
    table: { new(db: IDB): IToTable ;},
    from: (table: TTable) => AnyColumn,
    to: (table: IToTable) => AnyColumn,
  ) {
    const fromColumn = from(this.__table);
    // eslint-disable-next-line new-cap
    const toColumn = to(new table(new StubDB()));

    const join = new JoinWith(this._tableName, this._columns)
      .columns(fromColumn, toColumn).joinStrategy(JoinStrategy.LEFT_JOIN);

    return new SelectTRBWithJoin(this._tableName, this._session,
      this._filter, join, this._columns);
  }

  public rightJoin<IToTable extends AbstractTable<IToTable>>(
    table: { new(db: IDB): IToTable ;},
    from: (table: TTable) => AnyColumn,
    to: (table: IToTable) => AnyColumn,
  ) {
    const fromColumn = from(this.__table);
    // eslint-disable-next-line new-cap
    const toColumn = to(new table(new StubDB()));

    const join = new JoinWith(this._tableName, this._columns)
      .columns(fromColumn, toColumn).joinStrategy(JoinStrategy.RIGHT_JOIN);

    return new SelectTRBWithJoin(this._tableName, this._session,
      this._filter, join, this._columns);
  }

  public fullJoin<IToTable extends AbstractTable<IToTable>>(
    table: { new(db: IDB): IToTable ;},
    from: (table: TTable) => AnyColumn,
    to: (table: IToTable) => AnyColumn,
  ) {
    const fromColumn = from(this._table);
    // eslint-disable-next-line new-cap
    const toColumn = to(new table(new StubDB()));

    const join = new JoinWith(this._tableName, this._columns)
      .columns(fromColumn, toColumn).joinStrategy(JoinStrategy.FULL_JOIN);

    return new SelectTRBWithTwoJoins(
      this._tableName,
      this._session,
      this._filter,22
      this._join,
      join,
      this._columns,
    );
  }

  public join = <T2>(join: Join<COLUMN, T2>):
  SelectTRBWithTwoJoins<COLUMN, T1, T2, MODEL> => new SelectTRBWithTwoJoins(
    this._tableName,
    this._session,
    this._filter,
    this._join,
    join,
    this._columns,
  );

  public execute = async (): Promise<SelectResponseJoin<MODEL, T1>> => {
    const queryBuilder = Select.from(this._tableName, Object.values(this._columns));
    if (this._filter) {
      queryBuilder.filteredBy(this._filter);
    }

    queryBuilder.joined([this._join]);

    let query = '';
    try {
      query = queryBuilder.build();
    } catch (e) {
      throw new BuilderError(BuilderType.JOINED_SELECT,
        this._tableName, Object.values(this._columns), e, this._filter);
    }

    const parent:
    { [name in keyof ExtractModel<T1>]: Column<ColumnType>; } = this._join.mappedServiceToDb;

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
