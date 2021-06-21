import ColumnType from './columnType';

export default class PgVarChar extends ColumnType {
  protected size: number;
  protected dbName: string;

  public constructor(size: number) {
    super();
    this.size = size;
    this.dbName = `character varying(${this.size})`;
  }

  public getDbName = (): string => this.dbName;

  public insertStrategy = (value: any): string => `'${value.replace("'", "''")}'`;
}
