import ColumnType from './columnType';

export default class PgJsonb extends ColumnType {
  public dbName: string;

  public constructor() {
    super();
    this.dbName = 'JSONB';
  }

  public getDbName = (): string => this.dbName;

  public insertStrategy = (value: any): string => `'${JSON.stringify(value)}'::jsonb`;
}
