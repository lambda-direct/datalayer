/* eslint-disable max-len */
/* eslint-disable import/no-cycle */
import { AbstractColumn } from '../../columns/column';
import ColumnType from '../../columns/types/columnType';
import Session from '../../db/session';
import BuilderError, { BuilderType } from '../../errors/builderError';
import { DatabaseInsertError } from '../../errors/dbErrors';
import BaseLogger from '../../logger/abstractLogger';
import QueryResponseMapper from '../../mappers/responseMapper';
import { AbstractTable } from '../../tables';
import { ExtractModel, Indexing } from '../../tables/inferTypes';
import Insert from '../lowLvlBuilders/inserts/insert';
import { UpdateExpr } from '../requestBuilders/updates/updates';
import TableRequestBuilder from './abstractRequestBuilder';

export default class InsertTRB<TTable extends AbstractTable<TTable>> extends TableRequestBuilder<TTable> {
  private _values: ExtractModel<TTable>[];
  private _onConflict: UpdateExpr;
  private _onConflictField: Indexing;

  public constructor(
    values: ExtractModel<TTable>[],
    table: AbstractTable<TTable>,
    session: Session,
    mappedServiceToDb: { [name in keyof ExtractModel<TTable>]: AbstractColumn<ColumnType>; },
    logger?: BaseLogger,
  ) {
    super(table, session, mappedServiceToDb, logger);
    this._values = values;
  }

  public execute = async () => {
    await this._execute();
  };

  public onConflict = (
    callback: (table: TTable) => Indexing,
    expr: UpdateExpr,
  ): InsertTRB<TTable> => {
    this._onConflictField = callback(this._table);
    this._onConflict = expr;
    return this;
  };

  protected _execute = async (): Promise<ExtractModel<TTable>[]> => {
    if (!this._values) throw Error('Values should be provided firestly\nExample: table.values().execute()');

    const mappedRows: {[name: string]: any}[] = [];
    const mapper = this._mappedServiceToDb;

    this._values.forEach((valueToInsert) => {
      const mappedValue: {[name: string]: any} = {};
      Object.entries(valueToInsert).forEach(([key, value]) => {
        const column = mapper[key as keyof ExtractModel<TTable>];
        mappedValue[column.columnName] = value;
      });
      mappedRows.push(mappedValue);
    });

    const queryBuilder = Insert
      .into(this._table, this._columns)
      .values(mappedRows)
      .onConflict(this._onConflict, this._onConflictField);

    // @TODO refactor values() part!!
    let query = '';
    let values = [];
    try {
      const builderResult = queryBuilder.build();
      query = builderResult.query;
      values = builderResult.values;
    } catch (e: any) {
      throw new BuilderError(BuilderType.INSERT, this._tableName, this._columns, e);
    }

    if (this._logger) {
      this._logger.info(`Inserting to ${this._tableName} using query:\n ${query}`);
    }

    const result = await this._session.execute(query, values);
    if (result.isLeft()) {
      const { reason } = result.value;
      throw new DatabaseInsertError(this._tableName, reason, query);
    } else {
      return QueryResponseMapper.map(this._mappedServiceToDb, result.value);
    }
  };
}
