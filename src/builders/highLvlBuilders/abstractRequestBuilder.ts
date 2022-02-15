/* eslint-disable import/no-cycle */
/* eslint-disable max-len */
import { AbstractColumn, Column } from '../../columns/column';
import ColumnType from '../../columns/types/columnType';
import Session from '../../db/session';
import BaseLogger from '../../logger/abstractLogger';
import AbstractTable from '../../tables/abstractTable';
import { ExtractModel } from '../../tables/inferTypes';

export default abstract class TableRequestBuilder<TTable extends AbstractTable<TTable>> {
  protected _table: TTable;
  protected _tableName: string;
  protected _session: Session;
  protected _mappedServiceToDb: { [name in keyof ExtractModel<TTable>]: AbstractColumn<ColumnType>; };
  protected _columns: Column<ColumnType>[];
  protected _logger?: BaseLogger;

  public constructor(table: AbstractTable<TTable>,
    session: Session,
    mappedServiceToDb: { [name in keyof ExtractModel<TTable>]: AbstractColumn<ColumnType>; },
    logger?: BaseLogger) {
    this._mappedServiceToDb = mappedServiceToDb;
    this._table = table as unknown as TTable;
    this._session = session;
    this._columns = Object.values(mappedServiceToDb);
    this._logger = logger;
  }

  public all = async (): Promise<ExtractModel<TTable>[]> => {
    const res = await this._execute();
    return res;
  };

  public first = async (): Promise<ExtractModel<TTable>> => {
    const executionRes = await this._execute();
    // TODO add checks for undefined or null
    return executionRes[0];
  };

  protected abstract _execute(): Promise<Array<ExtractModel<TTable>>>;
}
