import { AbstractColumn } from '../../../columns/column';
import ColumnType from '../../../columns/types/columnType';
import UpdateExpr from './updates';

export default class Increment<T extends AbstractColumn<ColumnType<any>, boolean, boolean>>
  extends UpdateExpr {
  private _column: T;
  private _value: number;

  public constructor(column: T, value: number) {
    super();
    this._column = column;
    this._value = value;
  }

  public toQuery = (): string => `${this._column.columnName} = ${this._column.columnName} + ${this._value}`;
}
