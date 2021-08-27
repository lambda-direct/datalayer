/* eslint-disable max-len */
/* eslint-disable max-classes-per-file */
import { IDB, StubDB } from '../db/db';
import { AbstractTable } from '../tables';
import ColumnType from './types/columnType';

type ExtractColumnType<T extends ColumnType> =
 T extends ColumnType<infer TCodeType> ?
   TCodeType
   : never;

// eslint-disable-next-line max-len
export abstract class AbstractColumn<T extends ColumnType, TNullable extends boolean = true, TAutoIncrement extends boolean = false> {
  public columnType: T;
  public columnName: string;
  public isNullableFlag: TNullable;
  public autoIncrementType: TAutoIncrement;
  public autoIncrementFlag: boolean = false;
  public primaryKeyName: string | undefined = undefined;
  public uniqueKeyName: string | undefined = undefined;
  public defaultParam: any = null;
  public referenced: AbstractColumn<T, boolean, boolean>;

  protected parentTableName: string;

  public constructor(parentTableName: string, columnName: string,
    columnType: T, nullable: TNullable) {
    this.columnType = columnType;
    this.columnName = columnName;
    this.parentTableName = parentTableName;
    this.isNullableFlag = nullable;
  }

  public getAlias = (): string => `${this.parentTableName.replace('.', '_')}_${this.columnName}`;

  public getParent = (): string => this.parentTableName;

  public abstract foreignKey <ITable extends AbstractTable<ITable>>(table: { new(db: IDB): ITable ;},
    callback: (table: ITable) => AbstractColumn<T, boolean, boolean>)
  : AbstractColumn<T, TNullable, TAutoIncrement>;

  public defaultValue = (value: ExtractColumnType<T>) => {
    this.defaultParam = value;
    return this;
  };

  public abstract autoIncrement(): AbstractColumn<T, boolean, boolean>;

  public abstract primaryKey(): AbstractColumn<T, boolean, boolean>;

  public abstract serial(): AbstractColumn<T, boolean, boolean>;

  public unique = () => {
    this.uniqueKeyName = this.columnName;
    return this;
  };

  public isAutoIncrement = (): boolean => this.autoIncrementFlag;

  public getColumnName = (): string => this.columnName;

  public getReferenced = (): AbstractColumn<T, boolean, boolean> => this.referenced;

  public getColumnType = (): T => this.columnType;

  public getDefaultValue = (): any => this.defaultParam;
}

// eslint-disable-next-line max-len
export class Column<T extends ColumnType, TNullable extends boolean = true, TAutoIncrement extends boolean = false>
  extends AbstractColumn<T, TNullable, TAutoIncrement> {
  public constructor(parentTableName: string, columnName: string,
    columnType: T, nullable: TNullable) {
    super(parentTableName, columnName, columnType, nullable);
  }

  public serial() {
    this.autoIncrementFlag = true;
    return this as unknown as Column<T, false, true>;
  }

  public primaryKey() {
    this.primaryKeyName = `${this.parentTableName}_${this.columnName}`;
    // eslint-disable-next-line max-len
    return this as unknown as Column<T, TAutoIncrement extends true ? true : false, TAutoIncrement>;
  }

  public foreignKey<ITable extends AbstractTable<ITable>>(table: new (db: IDB) => ITable, callback: (table: ITable) => Column<T, boolean, boolean>): Column<T, TNullable, TAutoIncrement> {
    // eslint-disable-next-line new-cap
    this.referenced = callback(new table(new StubDB()));
    return this;
  }

  public autoIncrement() {
    this.autoIncrementFlag = true;
    return this as unknown as IndexedColumn<T, true, true>;
  }
}

// eslint-disable-next-line max-len
export class IndexedColumn<T extends ColumnType, TNullable extends boolean = true, TAutoIncrement extends boolean = false> extends AbstractColumn<T, TNullable, TAutoIncrement> {
  public constructor(parentTableName: string, columnName: string,
    columnType: T, nullable: TNullable) {
    super(parentTableName, columnName, columnType, nullable);
  }

  public serial() {
    this.autoIncrementFlag = true;
    return this as unknown as IndexedColumn<T, false, true>;
  }

  public primaryKey() {
    this.primaryKeyName = `${this.parentTableName}_${this.columnName}`;
    // eslint-disable-next-line max-len
    return this as unknown as IndexedColumn<T, TAutoIncrement extends true ? true : false, TAutoIncrement>;
  }

  public foreignKey<ITable extends AbstractTable<ITable>>(table: new (db: IDB) => ITable, callback: (table: ITable) => IndexedColumn<T, boolean, boolean>): IndexedColumn<T, TNullable, TAutoIncrement> {
    // eslint-disable-next-line new-cap
    this.referenced = callback(new table(new StubDB()));
    return this;
  }

  public autoIncrement() {
    this.autoIncrementFlag = true;
    return this as unknown as IndexedColumn<T, true, true>;
  }
}
