/* eslint-disable max-len */
/* eslint-disable import/no-cycle */
import { AbstractColumn, Column } from '../../columns/column';
import ColumnType from '../../columns/types/columnType';
import AbstractTable from '../../tables/abstractTable';
import { ecranate } from '../../utils/ecranate';

export default class Aggregator {
  protected _fields: Array<string> = [];
  protected _tableName: string;
  protected _table: AbstractTable<any>;
  protected _columnsTypes: Column<ColumnType>[];

  public constructor(table: AbstractTable<any>) {
    this._tableName = table.tableName();
    this._table = table;
    this._fields = this.generateSelectArray(this._tableName, Object.values(table.mapServiceToDb()));
  }

  public appendFields = (columns: Column<ColumnType>[]) => {
    this._fields = this.generateSelectArray(this._tableName, columns);
    this._columnsTypes = columns;
  };

  protected generateSelectArray = (table: string, columns: AbstractColumn<ColumnType>[], id?: number) => {
    const selectFields: string[] = [];

    columns.forEach((field: any) => {
      if (field instanceof AbstractColumn) {
        selectFields.push(' ');
        selectFields.push(table);
        selectFields.push('.');
        selectFields.push(ecranate(field.columnName));
        selectFields.push(' AS ');
        selectFields.push(ecranate(`${field.getAlias()}${id ? `_${id}` : ''}`));
        selectFields.push(',');
      }
    });

    selectFields.pop();
    return selectFields;
  };
}
