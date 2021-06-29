import Column from '../../columns/column';
import ColumnType from '../../columns/types/columnType';
import Session from '../../db/session';
import BaseLogger from '../../logger/abstractLogger';

export default abstract class TableRequestBuilder<T> {
  protected _tableName: string;
  protected _session: Session;
  protected _mappedServiceToDb: { [name in keyof T]: Column<ColumnType, {}>; };
  protected _columns: Column<ColumnType, {}>[];
  protected _logger: BaseLogger;

  public constructor(tableName: string,
    session: Session,
    mappedServiceToDb: { [name in keyof T]: Column<ColumnType, {}>; },
    columns: Column<ColumnType, {}>[],
    logger: BaseLogger) {
    this._mappedServiceToDb = mappedServiceToDb;
    this._tableName = tableName;
    this._session = session;
    this._columns = columns;
    this._logger = logger;
  }

  public all = async (): Promise<T[]> => this.execute();

  public first = async (): Promise<T> => {
    const executionRes = await this.execute();
    // TODO add checks for undefined or null
    return executionRes[0];
  };

  protected abstract execute(): Promise<Array<T>>;
}
