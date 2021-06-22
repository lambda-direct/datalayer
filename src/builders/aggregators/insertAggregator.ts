import Column from '../../columns/column';
import ColumnType from '../../columns/types/columnType';
import Aggregator from './abstractAggregator';

export default class InsertAggregator extends Aggregator {
  private _onConflict: Array<string> = [];
  private _columns: Array<string> = [];
  private _values: Array<string> = [];
  private _from: Array<string> = [];
  private _insert: Array<string> = ['INSERT INTO'];

  public constructor(tableName: string) {
    super(tableName);
  }

  public appendFrom = (tableName: string): InsertAggregator => {
    this._from.push(' ');
    this._from.push(tableName);
    this._tableName = tableName;
    return this;
  };

  // @TODO refactor!!
  public appendColumns = <T>(values: Array<T>) => {
    // @TODO Check if values not empty
    const columns = Object.keys(values[0]);

    for (let i = 0; i < columns.length; i += 1) {
      const column = columns[i];

      this._columns.push('"');
      this._columns.push(column);
      this._columns.push('"');

      if (i < columns.length - 1) {
        this._columns.push(', ');
      }
    }
  };

  // @TODO refactor!!
  public appendValues = <T>(mapper: {[name in keyof T]: Column<ColumnType, {}>},
    values: {[name: string]: any}[]) => {
    // @TODO Check if values not empty
    for (let i = 0; i < values.length; i += 1) {
      const value = values[i];
      const insertValues = Object.values(value);
      const insertKeys = Object.keys(value);

      this._values.push('(');
      for (let j = 0; j < insertValues.length; j += 1) {
        const insertValue = insertValues[j];
        const insertKey = insertKeys[j];

        const columnKey = Object.keys(mapper)
          .find((it) => mapper[it as keyof T].columnName === insertKey)!;
        const column = mapper[columnKey as keyof T];

        if (insertValue) {
          this._values.push(column.columnType.insertStrategy(insertValue));
        } else {
          this._values.push('null');
        }

        if (j < insertValues.length - 1) {
          this._values.push(', ');
        }
      }
      if (i < values.length - 1) {
        this._values.push('),\n');
      } else {
        this._values.push(')\n');
      }
    }
  };

  // public appendOnConflict = (updates: UpdateExpr) => this;

  public buildQuery = () => {
    this._insert.push(this._from.join(''));
    this._insert.push(' (');
    this._insert.push(this._columns.join(''));
    this._insert.push(') ');
    this._insert.push('VALUES\n');
    this._insert.push(this._values.join(''));
    this._insert.push('\n');
    this._insert.push('\n');
    this._insert.push('RETURNING');
    this._insert.push('\n');
    this._insert.push(this._fields.join(''));
    // @TODO onConflict. Research better ways to handle several primary or unique fields
    // this._insert.push("ON CONFLICT ON CONSTRAINT \"");
    // this._insert.push(this._table.tableName());
    // this._insert.push("_");
    // this._insert.push(this._table);
    // this._insert.push("\n");
    // this._insert.push(this._fields.join(''));

    return this._insert.join('');
  };
}
