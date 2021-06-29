import Column from '../../columns/column';
import ColumnType from '../../columns/types/columnType';
import Session from '../../db/session';
import BuilderError, { BuilderType } from '../../errors/builderError';
import { DatabaseSelectError } from '../../errors/dbErrors';
import BaseLogger from '../../logger/abstractLogger';
import QueryResponseMapper from '../../mappers/responseMapper';
import SelectTRBWithJoin from '../joinBuilders/builders/selectWithJoin';
import Join from '../joinBuilders/join';
import Select from '../lowLvlBuilders/selects/select';
import Expr from '../requestBuilders/where/where';
import TableRequestBuilder from './abstractRequestBuilder';

export default class SelectTRB<T> extends TableRequestBuilder<T> {
  protected _filter: Expr;

  public constructor(
    tableName: string,
    session: Session,
    mappedServiceToDb: { [name in keyof T]: Column<ColumnType, {}>; },
    columns: Column<ColumnType, {}>[],
    logger: BaseLogger,
  ) {
    super(tableName, session, mappedServiceToDb, columns, logger);
  }

  public where = (expr: Expr): SelectTRB<T> => {
    this._filter = expr;
    return this;
  };

  public join = <COLUMN extends ColumnType, T1>(join: Join<COLUMN, T1>):
  SelectTRBWithJoin<COLUMN, T1,
  T> => new SelectTRBWithJoin(this._tableName, this._session,
    this._filter, join, this._mappedServiceToDb);

  public execute = async (): Promise<T[]> => {
    const queryBuilder = Select.from(this._tableName, this._columns);
    if (this._filter) {
      queryBuilder.filteredBy(this._filter);
    }

    let query = '';
    try {
      query = queryBuilder.build();
    } catch (e) {
      throw new BuilderError(BuilderType.SELECT, this._tableName, this._columns, e, this._filter);
    }

    this._logger.info(`Select query from Console Logger implementation:\n ${query}`);

    const result = await this._session.execute(query);
    if (result.isLeft()) {
      const { reason } = result.value;
      throw new DatabaseSelectError(this._tableName, reason, query);
    } else {
      return QueryResponseMapper.map(this._mappedServiceToDb, result.value);
    }
  };
}
