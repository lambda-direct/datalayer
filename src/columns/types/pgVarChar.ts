import ColumnType from './columnType';

export default class PgVarChar extends ColumnType<string> {
  protected size?: number;
  protected dbName: string;

  public constructor(size?: number) {
    super();
    this.size = size;
    if (size) {
      this.dbName = `character varying(${size})`;
    } else {
      this.dbName = 'character varying';
    }
  }

  public getDbName = (): string => this.dbName;

  public insertStrategy = (value: string): string => `'${value.replace("'", "''")}'`;

  public selectStrategy(value: string): string {
    return value;
  }
}
