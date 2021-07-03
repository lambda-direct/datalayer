import ColumnType from './columnType';

export default class PgEnum extends ColumnType {
  public dbName: string;
  public name: string;

  public constructor(name: string) {
    super();
    this.dbName = 'ENUM';
    this.name = name;
  }

  public getDbName = (): string => this.dbName;

  public insertStrategy = (value: any): string => `'${value}'`;
}
