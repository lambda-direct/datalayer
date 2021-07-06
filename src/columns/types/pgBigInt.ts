import ColumnType from './columnType';

export default class PgBigInt extends ColumnType<number> {
  public dbName: string;

  public constructor() {
    super();
    this.dbName = 'BIGINT';
  }

  public getDbName(): string {
    return this.dbName;
  }

  public insertStrategy = (value: any): string => `${value}`;
}
