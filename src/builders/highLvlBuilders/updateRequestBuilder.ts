/* eslint-disable max-len */
/* eslint-disable import/no-cycle */
import { AbstractColumn } from '../../columns/column';
import ColumnType from '../../columns/types/columnType';
import Session from '../../db/session';
import BuilderError, { BuilderType } from '../../errors/builderError';
import { DatabaseUpdateError } from '../../errors/dbErrors';
import BaseLogger from '../../logger/abstractLogger';
import QueryResponseMapper from '../../mappers/responseMapper';
import { AbstractTable } from '../../tables';
import { ExtractModel } from '../../tables/inferTypes';
import Update from '../lowLvlBuilders/updates/update';
import { UpdateExpr } from '../requestBuilders/updates/updates';
import Expr from '../requestBuilders/where/where';
import TableRequestBuilder from './abstractRequestBuilder';

export default class UpdateTRB<TTable extends AbstractTable<TTable>> extends TableRequestBuilder<TTable> {
  private _filter: Expr;
  private _update: UpdateExpr;

  public constructor(
    table: AbstractTable<TTable>,
    session: Session,
    mappedServiceToDb: { [name in keyof ExtractModel<TTable>]: AbstractColumn<ColumnType>; },
    logger?: BaseLogger,
  ) {
    super(table, session, mappedServiceToDb, logger);
  }

  public where = (expr: Expr): UpdateTRB<TTable> => {
    this._filter = expr;
    return this;
  };

  public set = (expr: UpdateExpr): UpdateTRB<TTable> => {
    this._update = expr;
    return this;
  };

  public execute = async () => {
    await this._execute();
  };

  protected _execute = async (): Promise<ExtractModel<TTable>[]> => {
    let query = '';
    let values = [];
    try {
      const builderResult = Update.in(this._table)
        .columns(this._columns)
        .set(this._update).filteredBy(this._filter)
        .build();

      query = builderResult.query;
      values = builderResult.values;
    } catch (e) {
      throw new BuilderError(BuilderType.UPDATE, this._tableName, this._columns, e, this._filter);
    }

    if (this._logger) {
      this._logger.info(`Updating ${this._tableName} using query:\n ${query}`);
    }
    const result = await this._session.execute(query, values);
    if (result.isLeft()) {
      const { reason } = result.value;
      throw new DatabaseUpdateError(this._tableName, reason, query);
    } else {
      return QueryResponseMapper.map(this._mappedServiceToDb, result.value);
    }
  };
}
