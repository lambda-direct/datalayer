import AbstractTable from '../tables/abstractTable';
import ColumnType from './types/columnType';
import PgInteger from './types/pgInteger';
import PgVarChar from './types/pgVarChar';
import PgTimestamp from './types/pgTimestamp';
import PgBigDecimal from './types/pgBigDecimal';
import PgTime from './types/pgTime';
import PgBoolean from './types/pgBoolean';
import PgText from './types/pgText';
import PgJsonb from './types/pgJsonb';

export default class Column<T extends ColumnType> {
  public columnType: T;
  public columnName: string;
  public isNullableFlag: boolean = false;
  public autoIncrementFlag: boolean = false;
  public primaryKeyName: string | undefined = undefined;
  public uniqueKeyName: string | undefined = undefined;
  public defaultParam: any = null;
  public referenced: Column<T>;

  private parent: AbstractTable<{}>;

  public constructor(parent: AbstractTable<{}>, columnName: string, columnType: T) {
    this.columnType = columnType;
    this.columnName = columnName;
    this.parent = parent;
  }

  public static varchar = (parent: AbstractTable<any>, name:string, size: number):
  Column<PgVarChar> => new Column<PgVarChar>(parent, name, new PgVarChar(size));

  public static timestamp = (parent:AbstractTable<any>, name:string):
  Column<PgTimestamp> => new Column<PgTimestamp>(parent, name, new PgTimestamp());

  public static int = (parent:AbstractTable<any>, name:string):
  Column<PgInteger> => new Column<PgInteger>(parent, name, new PgInteger());

  public static decimal = (parent:AbstractTable<any>, name:string, precision: number,
    scale: number): Column<PgBigDecimal> => new Column<PgBigDecimal>(parent,
    name, new PgBigDecimal(precision, scale));

  public static time = (parent:AbstractTable<any>, name:string):
  Column<PgTime> => new Column<PgTime>(parent, name, new PgTime());

  public static bool = (parent:AbstractTable<any>, name:string):
  Column<PgBoolean> => new Column<PgBoolean>(parent, name, new PgBoolean());

  public static text = (parent:AbstractTable<any>, name:string):
  Column<PgText> => new Column<PgText>(parent, name, new PgText());

  public static jsonb = (parent:AbstractTable<any>, name:string):
  Column<PgJsonb> => new Column<PgJsonb>(parent, name, new PgJsonb());

  public getAlias = (): string => `${this.parent.tableName().replace('.', '_')}_${this.columnName}`;

  public getParent = (): AbstractTable<{}> => this.parent;

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
    this.primaryKeyName = `${this.parent.tableName()}_${this.columnName}`;
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
