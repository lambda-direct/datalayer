import Column from '../../columns/column';
import ColumnType from '../../columns/types/columnType';
import Session from '../../db/session';
import BuilderError, { BuilderType } from '../../errors/builderError';
import { DatabaseInsertError } from '../../errors/dbErrors';
import BaseLogger from '../../logger/abstractLogger';
import QueryResponseMapper from '../../mappers/responseMapper';
import Insert from '../lowLvlBuilders/inserts/insert';
import TableRequestBuilder from './abstractRequestBuilder';

export default class InsertTRB<T> extends TableRequestBuilder<T> {
  private _values: Partial<T>[];

  public constructor(
    values: Partial<T>[],
    tableName: string,
    session: Session,
    mappedServiceToDb: { [name in keyof T]: Column<ColumnType, {}>; },
    columns: Column<ColumnType, {}>[],
    logger: BaseLogger,
  ) {
    super(tableName, session, mappedServiceToDb, columns, logger);
    this._values = values;
  }

  public execute = async () => {
    this._execute();
  };

  protected _execute = async (): Promise<T[]> => {
    const queryBuilder = Insert.into(this._tableName, this._columns);
    if (!this._values) throw Error('Values should be provided firestly\nExample: table.values().execute()');

    const mappedRows: {[name: string]: any}[] = [];
    const mapper = this._mappedServiceToDb;

    this._values.forEach((valueToInsert) => {
      const mappedValue: {[name: string]: any} = {};
      Object.entries(valueToInsert).forEach(([key, value]) => {
        const column = mapper[key as keyof T];
        mappedValue[column.columnName] = value;
      });
      mappedRows.push(mappedValue);
    });

    // @TODO refactor values() part!!
    let query = '';
    try {
      query = queryBuilder.values(mappedRows, mapper).build();
    } catch (e) {
      throw new BuilderError(BuilderType.INSERT, this._tableName, this._columns, e);
    }

    if (this._logger) {
      this._logger.info(`Inserting to ${this._tableName} using query:\n ${query}`);
    }

    const result = await this._session.execute(query);
    if (result.isLeft()) {
      const { reason } = result.value;
      throw new DatabaseInsertError(this._tableName, reason, query);
    } else {
      return QueryResponseMapper.map(this._mappedServiceToDb, result.value);
    }
  };
}
