import ColumnType from './columnType';

export default class PgInteger extends ColumnType {
  public dbName: string;

  public constructor() {
    super();
    this.dbName = 'INT';
  }

  public getDbName = (): string => this.dbName;

  public insertStrategy = (value: any): string => `${value}`;
}
