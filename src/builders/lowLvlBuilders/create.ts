import Column from '../../columns/column';
import AbstractTable from '../../tables/abstractTable';
import { ecranate } from '../../utils/ecranate';

export default class Create<SERVICE> {
  private tableBuilder: Array<string> = [];
  private columnsBuilder: Array<string> = [];
  private primaryKey: Array<string> = [];
  private uniqueKey: Array<string> = [];
  private tableClass: AbstractTable<SERVICE>;

  private constructor(tableClass: AbstractTable<SERVICE>) {
    this.tableClass = tableClass;
  }

  public static table = <SSERVICE>(tableClass:
  AbstractTable<SSERVICE>): Create<SSERVICE> => new Create(tableClass);

  public static type = <SSERVICE>(enumType:
  any): Create<SSERVICE> => new Create(enumType);

  public build = (): string => {
    this.tableBuilder.push('CREATE TABLE IF NOT EXISTS ');
    this.tableBuilder.push(this.tableClass.tableName());
    this.tableBuilder.push(' (');

    const tableValues = Object.values(this.tableClass);
    const columns = tableValues.filter((value) => value instanceof Column);

    for (let i = 0; i < columns.length; i += 1) {
      const column = columns[i];

      if (column instanceof Column) {
        this.columnsBuilder.push(ecranate(column.getColumnName()));
        this.columnsBuilder.push(' ');
        this.columnsBuilder.push(column.isAutoIncrement() ? 'SERIAL' : column.getColumnType().getDbName());
        this.columnsBuilder.push(' ');
        this.columnsBuilder.push(column.getDefaultValue() != null ? `DEFAULT ${column.getColumnType().insertStrategy(column.getDefaultValue())}` : '');
        this.columnsBuilder.push(column.getIsNullable() ? '' : ' NOT NULL');

        const referenced: Column<any> = column.getReferenced();
        this.columnsBuilder.push(referenced != null ? ` REFERENCES ${referenced.getParent()} (${referenced.getColumnName()})` : '');

        if (i !== columns.length - 1) {
          this.columnsBuilder.push(',');
        }
      }
    }

    const primaryKeys: Column<any>[] = [];
    const uniqueKeys: Column<any>[] = [];

    Object.values(this.tableClass).forEach((field) => {
      if (field instanceof Column) {
        if (field.primaryKeyName) {
          primaryKeys.push(field);
        }
        if (field.uniqueKeyName) {
          uniqueKeys.push(field);
        }
      }
    });

    if (primaryKeys.length !== 0) {
      this.primaryKey.push(',');
      this.primaryKey.push(`\nCONSTRAINT ${this.tableClass.tableName()}_${primaryKeys[0].getColumnName()}`);
      this.primaryKey.push(' PRIMARY KEY(');

      for (let i = 0; i < primaryKeys.length; i += 1) {
        const column: Column<any> = primaryKeys[i];
        this.primaryKey.push(column.getColumnName());

        if (i !== primaryKeys.length - 1) {
          this.primaryKey.push(',');
        }
      }
      this.primaryKey.push(')');
    }

    if (uniqueKeys.length !== 0) {
      const columnName: string = uniqueKeys[0].getColumnName();
      this.uniqueKey.push(',');
      this.uniqueKey.push(`\nCONSTRAINT ${this.tableClass.tableName()}_${columnName}`);
      this.uniqueKey.push(' UNIQUE(');

      for (let i = 0; i < uniqueKeys.length; i += 1) {
        const column: Column<any> = uniqueKeys[i];
        this.uniqueKey.push(column.getColumnName());

        if (i !== uniqueKeys.length - 1) {
          this.uniqueKey.push(',');
        }
      }
      this.uniqueKey.push(')');
    }

    return `${this.tableBuilder.join('') + this.columnsBuilder.join('') + this.primaryKey.join('') + this.uniqueKey.join('')});`;
  };
}
