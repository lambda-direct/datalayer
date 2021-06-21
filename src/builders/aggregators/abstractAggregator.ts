import Column from '../../columns/column';
import AbstractTable from '../../tables/abstractTable';
import { ecranate } from '../../utils/ecranate';

export default class Aggregator<SERVICE> {
  protected _fields: Array<string> = [];
  protected _table: AbstractTable<SERVICE>;

  public constructor(table: AbstractTable<SERVICE>) {
    this._table = table;
  }

  public appendFields = () => {
    this._fields = this.generateSelectArray(this._table);
  };

  protected generateSelectArray = (table: AbstractTable<SERVICE>) => {
    const selectFields: any = [];

    Object.values(table).forEach((field: any) => {
      if (field instanceof Column) {
        selectFields.push(' ');
        selectFields.push(table.tableName());
        selectFields.push('.');
        selectFields.push(ecranate(field.columnName));
        selectFields.push(' AS ');
        selectFields.push(ecranate(`${table.tableName().replace('.', '_')}_${field.columnName}`));
        selectFields.push(',');
      }
    });

    selectFields.pop();
    return selectFields;
  };
}
