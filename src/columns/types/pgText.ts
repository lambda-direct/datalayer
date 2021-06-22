import ColumnType from './columnType';

export default class PgText extends ColumnType {
  protected dbName: string;

  public constructor() {
    super();
    this.dbName = 'TEXT';
  }

  public getDbName = (): string => this.dbName;

  public insertStrategy = (value: any): string => `'${value.replace("'", "''")}'`;
}
