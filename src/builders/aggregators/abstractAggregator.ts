import Column from '../../columns/column';
import ColumnType from '../../columns/types/columnType';
import { ecranate } from '../../utils/ecranate';

export default class Aggregator {
  protected _fields: Array<string> = [];
  protected _tableName: string;
  protected _columnsTypes: Column<ColumnType, {}>[];

  public constructor(tableName: string) {
    this._tableName = tableName;
  }

  public appendFields = (columns: Column<ColumnType, {}>[]) => {
    this._fields = this.generateSelectArray(this._tableName, columns);
    this._columnsTypes = columns;
  };

  protected generateSelectArray = (table: string, columns: Column<ColumnType, {}>[]) => {
    const selectFields: string[] = [];

    columns.forEach((field: any) => {
      if (field instanceof Column) {
        selectFields.push(' ');
        selectFields.push(table);
        selectFields.push('.');
        selectFields.push(ecranate(field.columnName));
        selectFields.push(' AS ');
        selectFields.push(ecranate(`${table.replace('.', '_')}_${field.columnName}`));
        selectFields.push(',');
      }
    });

    selectFields.pop();
    return selectFields;
  };
}
