import ColumnType from './columnType';

export default class PgTimestamp extends ColumnType {
  public dbName: string;

  public constructor() {
    super();
    this.dbName = 'timestamp without time zone';
  }

  public getDbName = (): string => this.dbName;

  public insertStrategy = (value: any): string => `'${value.toISOString()}'`;
}
