import ColumnType from './types/columnType';

export default class Column<T extends ColumnType, SUBTYPE = {}> {
  public columnType: T;
  public columnName: string;
  public isNullableFlag: boolean = false;
  public autoIncrementFlag: boolean = false;
  public primaryKeyName: string | undefined = undefined;
  public uniqueKeyName: string | undefined = undefined;
  public defaultParam: any = null;
  public referenced: Column<T>;
  public subtype?: SUBTYPE;

  private parentTableName: string;

  public constructor(parentTableName: string, columnName: string, columnType: T,
    subtype?: SUBTYPE) {
    this.columnType = columnType;
    this.columnName = columnName;
    this.parentTableName = parentTableName;
    this.subtype = subtype;
  }

  public getAlias = (): string => `${this.parentTableName.replace('.', '_')}_${this.columnName}`;

  public getParent = (): string => this.parentTableName;

  public references = (column: Column<T>): Column<T> => {
    this.referenced = column;
    return this;
  };

  public isNullable = () => {
    this.isNullableFlag = true;
    return this;
  };

  public defaultValue = (value: any) => {
    this.defaultParam = value;
    return this;
  };

  public autoIncrement = () => {
    this.autoIncrementFlag = true;
    return this;
  };

  public primaryKey = () => {
    this.primaryKeyName = `${this.parentTableName}_${this.columnName}`;
    return this;
  };

  public unique = () => {
    this.uniqueKeyName = this.columnName;
    return this;
  };

  public isAutoIncrement = (): boolean => this.autoIncrementFlag;

  public getIsNullable = (): boolean => this.isNullableFlag;

  public getColumnName = (): string => this.columnName;

  public getReferenced = (): Column<T> => this.referenced;

  public getColumnType = (): T => this.columnType;

  public getDefaultValue = (): any => this.defaultParam;
}
