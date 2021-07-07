import Column from '../../../columns/column';
import ColumnType from '../../../columns/types/columnType';
import UpdateExpr from './updates';

export default class SetObject<T extends ColumnType> extends UpdateExpr {
  private _column: Column<T, boolean, boolean>;
  private _value: any;

  public constructor(column: Column<T, boolean, boolean>, value: any) {
    super();
    this._column = column;
    this._value = value;
  }

  public toQuery = (): string => `"${this._column.columnName}"=${this._column.columnType.insertStrategy(this._value)}`
  ;
}
