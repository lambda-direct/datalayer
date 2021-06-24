import ColumnType from './columnType';

export default class PgBigInt extends ColumnType {
  public dbName: string;

  public constructor() {
    super();
    this.dbName = 'BIGINT';
  }

  public getDbName = (): string => this.dbName;

  public insertStrategy = (value: any): string => `${value}`;
}
