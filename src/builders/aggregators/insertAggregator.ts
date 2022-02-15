/* eslint-disable import/no-cycle */
/* eslint-disable @typescript-eslint/no-loop-func */
import { IndexedColumn } from '../../columns/column';
import AbstractTable from '../../tables/abstractTable';
import { Indexing } from '../../tables/inferTypes';
import { UpdateExpr } from '../requestBuilders/updates/updates';
import Aggregator from './abstractAggregator';

export default class InsertAggregator extends Aggregator {
  private _onConflict: Array<string> = [];
  private _columns: Array<string> = [];
  private _query: Array<string> = [];
  private _values: Array<string> = [];
  private _from: Array<string> = [];
  private _insert: Array<string> = ['INSERT INTO'];

  public constructor(table: AbstractTable<any>) {
    super(table);
  }

  public appendFrom = (tableName: string): InsertAggregator => {
    this._from.push(' ');
    this._from.push(tableName);
    this._tableName = tableName;
    return this;
  };

  // @TODO refactor!!
  public appendColumns = () => {
    // @TODO Check if values not empty
    const mapper = this._table.mapServiceToDb();
    const columns = Object.values(mapper);

    for (let i = 0; i < columns.length; i += 1) {
      const column = columns[i];

      this._columns.push('"');
      this._columns.push(column.getColumnName());
      this._columns.push('"');

      if (i < columns.length - 1) {
        this._columns.push(', ');
      }
    }
  };

  // @TODO refactor!!
  public appendValues = (values: {[name: string]: any}[]) => {
    // @TODO Check if values not empty
    const mapper = this._table.mapServiceToDb();
    console.log(mapper);

    let position: number = 0;
    for (let i = 0; i < values.length; i += 1) {
      const value = values[i];

      this._query.push('(');
      const entries = Object.entries(mapper);

      entries.forEach(([key], index) => {
        console.log('key: ', key);
        console.log('value: ', value);
        const column = mapper[key];
        const valueToInsert = value[column.getColumnName()];
        const isKeyExistsInValue = column.getColumnName() in value;

        if (isKeyExistsInValue) {
          if (valueToInsert !== undefined && valueToInsert !== null) {
            position += 1;
            this._query.push(`$${position}`);
            this._values.push(column.getColumnType().insertStrategy(valueToInsert));
          } else {
            this._query.push('null');
          }
        } else {
          this._query.push('DEFAULT');
        }

        if (index < entries.length - 1) {
          this._query.push(', ');
        }
      });

      if (i < values.length - 1) {
        this._query.push('),\n');
      } else {
        this._query.push(')\n');
      }
    }
  };

  public appendOnConflict = (column: Indexing,
    updates?: UpdateExpr) => {
    if (column) {
      const indexName = column instanceof IndexedColumn
        ? column.getColumnName() : column.getColumns().map((it) => it.getColumnName()).join(',');
      this._onConflict.push(`ON CONFLICT (${indexName})\n`);
      if (updates) {
        const currentPointerPosition = this._values.length > 0
          ? this._values.length + 1 : undefined;

        const updatesQuery = updates.toQuery(currentPointerPosition);

        this._onConflict.push('DO UPDATE\n');
        this._onConflict.push(`SET ${updatesQuery.query}`);

        this._values.push(...updatesQuery.values);
      } else {
        this._onConflict.push('DO NOTHING\n');
      }
    }
    return this;
  };

  public buildQuery = () => {
    this._insert.push(this._from.join(''));
    this._insert.push(' (');
    this._insert.push(this._columns.join(''));
    this._insert.push(') ');
    this._insert.push('VALUES\n');
    this._insert.push(this._query.join(''));
    this._insert.push('\n');
    this._insert.push(this._onConflict.join(''));
    this._insert.push('\n');
    this._insert.push('RETURNING');
    this._insert.push('\n');
    this._insert.push(this._fields.join(''));

    return { query: this._insert.join(''), values: this._values };
  };
}
