import ColumnType from './types/columnType';

export default class Column<T extends ColumnType, TNullable extends boolean = true,
TAutoIncrement extends boolean = false> {
  public columnType: T;
  public columnName: string;
  public isNullableFlag: TNullable;
  public autoIncrementType: TAutoIncrement;
  public autoIncrementFlag: boolean = false;
  public primaryKeyName: string | undefined = undefined;
  public uniqueKeyName: string | undefined = undefined;
  public defaultParam: any = null;
  public referenced: Column<T, boolean, boolean>;

  private parentTableName: string;

  public constructor(parentTableName: string, columnName: string,
    columnType: T, nullable: TNullable) {
    this.columnType = columnType;
    this.columnName = columnName;
    this.parentTableName = parentTableName;
    this.isNullableFlag = nullable;
  }

  public getAlias = (): string => `${this.parentTableName.replace('.', '_')}_${this.columnName}`;

  public getParent = (): string => this.parentTableName;

  public references = (column: Column<T, boolean, boolean>)
  : Column<T, TNullable, TAutoIncrement> => {
    this.referenced = column;
    return this;
  };

  public defaultValue = (value: any) => {
    this.defaultParam = value;
    return this;
  };

  public autoIncrement() {
    this.autoIncrementFlag = true;
    return this as unknown as Column<T, true, true>;
  }

  public primaryKey() {
    this.primaryKeyName = `${this.parentTableName}_${this.columnName}`;
    return this as unknown as Column<T, TAutoIncrement extends true ? true : false, TAutoIncrement>;
  }

  public unique = () => {
    this.uniqueKeyName = this.columnName;
    return this;
  };

  public isAutoIncrement = (): boolean => this.autoIncrementFlag;

  public getIsNullable = (): boolean => this.isNullableFlag;

  public getColumnName = (): string => this.columnName;

  public getReferenced = (): Column<T, boolean, boolean> => this.referenced;

  public getColumnType = (): T => this.columnType;

  public getDefaultValue = (): any => this.defaultParam;
}
