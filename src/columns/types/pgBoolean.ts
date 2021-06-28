import ColumnType from './columnType';

export default class PgBoolean extends ColumnType {
  public dbName: string;

  public constructor() {
    super();
    this.dbName = 'boolean';
  }

  public getDbName = (): string => this.dbName;

  public insertStrategy = (value: any): string => `${value}`;
}
