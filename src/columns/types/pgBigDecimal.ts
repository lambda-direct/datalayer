import ColumnType from './columnType';

export default class PgBigDecimal extends ColumnType {
  public precision: number;
  public scale: number;
  public dbName: string;

  public constructor(precision: number, scale: number) {
    super();
    this.precision = precision;
    this.scale = scale;
    this.dbName = `numeric(${this.precision},${this.scale})`;
  }

  public getDbName = (): string => this.dbName;

  public insertStrategy = (value: any): string => `${value}`;
}
