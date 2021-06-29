import Column from '../../columns/column';
import ColumnType from '../../columns/types/columnType';
import Session from '../../db/session';
import BuilderError, { BuilderType } from '../../errors/builderError';
import { DatabaseUpdateError } from '../../errors/dbErrors';
import BaseLogger from '../../logger/abstractLogger';
import QueryResponseMapper from '../../mappers/responseMapper';
import Update from '../lowLvlBuilders/updates/update';
import UpdateExpr from '../requestBuilders/updates/updates';
import Expr from '../requestBuilders/where/where';
import TableRequestBuilder from './abstractRequestBuilder';

export default class UpdateTRB<T> extends TableRequestBuilder<T> {
  private _filter: Expr;
  private _update: UpdateExpr;

  public constructor(
    tableName: string,
    session: Session,
    mappedServiceToDb: { [name in keyof T]: Column<ColumnType, {}>; },
    columns: Column<ColumnType, {}>[],
    logger: BaseLogger,
  ) {
    super(tableName, session, mappedServiceToDb, columns, logger);
  }

  public where = (expr: Expr): UpdateTRB<T> => {
    this._filter = expr;
    return this;
  };

  public set = (expr: UpdateExpr): UpdateTRB<T> => {
    this._update = expr;
    return this;
  };

  public execute = async (): Promise<T[]> => {
    let query = '';
    try {
      query = Update.in(this._tableName)
        .columns(this._columns)
        .set(this._update).filteredBy(this._filter)
        .build();
    } catch (e) {
      throw new BuilderError(BuilderType.UPDATE, this._tableName, this._columns, e, this._filter);
    }

    if (this._logger) {
      this._logger.info(`Updating ${this._tableName} using query:\n ${query}`);
    }
    const result = await this._session.execute(query);
    if (result.isLeft()) {
      const { reason } = result.value;
      throw new DatabaseUpdateError(this._tableName, reason, query);
    } else {
      return QueryResponseMapper.map(this._mappedServiceToDb, result.value);
    }
  };
}
