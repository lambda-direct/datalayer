import Column from '../../../columns/column';
import ColumnType from '../../../columns/types/columnType';
import UpdateExpr from './updates';

export default class SetObject<T extends Column<ColumnType<any>, boolean, boolean>>
  extends UpdateExpr {
  private _column: T;
  private _value: any;

  public constructor(column: T, value: any) {
    super();
    this._column = column;
    this._value = value;
  }

  public toQuery = (): string => `"${this._column.columnName}"=${this._column.columnType.insertStrategy(this._value)}`
  ;
}
