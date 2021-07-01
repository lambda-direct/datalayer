import Column from '../../../columns/column';
import ColumnType from '../../../columns/types/columnType';
import UpdateExpr from './updates';

export default class SetObject<T extends ColumnType> extends UpdateExpr {
  private _column: Column<T>;
  private _value: any;

  public constructor(column: Column<T>, value: any) {
    super();
    this._column = column;
    this._value = value;
  }

  public toQuery = (): string => {
    if (typeof this._value === 'string' || this._value instanceof Date) {
      this._value = typeof this._value === 'string' ? this._value.replace("'", "''") : this._value;
      if (this._value instanceof Date) this._value = this._value.toISOString();
      return `"${this._column.columnName}"='${this._column.columnType.insertStrategy(this._value.toString())}'`;
    }
    return `"${this._column.columnName}"=${this._column.columnType.insertStrategy(this._value.toString())}`;
  };
}
