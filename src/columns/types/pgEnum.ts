import ColumnType from './columnType';

export default class PgEnum extends ColumnType {
  public dbName: string;

  public constructor() {
    super();
    this.dbName = 'ENUM';
  }

  public getDbName = (): string => this.dbName;

  public insertStrategy = (value: any): string => `${value}`;
}
