import ColumnType from './columnType';

export default class PgTime extends ColumnType {
  public dbName: string;

  public constructor() {
    super();
    this.dbName = 'time without time zone';
  }

  public getDbName = (): string => this.dbName;

  public insertStrategy = (value: any): string => value.toISOString();
}
