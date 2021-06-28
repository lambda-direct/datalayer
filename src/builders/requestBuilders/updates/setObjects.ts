import UpdateExpr from './updates';

export default class SetObject extends UpdateExpr {
  private _column: String;
  private _value: any;

  public constructor(column: String, value: any) {
    super();
    this._column = column;
    this._value = value;
  }

  public toQuery = (): string => {
    if (typeof this._value === 'string' || this._value instanceof Date) {
      this._value = typeof this._value === 'string' ? this._value.replace("'", "''") : this._value;
      if (this._value instanceof Date) this._value = this._value.toISOString();
      return `"${this._column}"='${this._value.toString()}'`;
    }
    return `"${this._column}"=${this._value.toString()}`;
  };
}
