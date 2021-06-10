import { AbstractTable } from "../tables/abstractTable";
import { ColumnType } from "./types/columnType";
import { PgInteger } from "./types/pgInteger";
import { PgVarChar } from "./types/pgVarChar";
import { PgTimestamp } from "./types/pgTimestamp";
import { PgBigDecimal } from "./types/pgBigDecimal";
import { PgTime } from "./types/pgTime";
import { PgBoolean } from "./types/pgBoolean";
import { PgText } from "./types/pgText";

export class Column<T extends ColumnType> {
    private parent: AbstractTable;

    columnType: T;
    columnName: string;
    isNullableFlag: boolean = false;
    autoIncrementFlag: boolean = false;
    primaryKeyName: string | undefined = undefined;
    uniqueKeyName: string | undefined = undefined;
    defaultValueParam: any = null;
    referenced: Column<T>;

    private constructor(parent: AbstractTable, columnName: string, columnType: T){
        this.columnType = columnType;
        this.columnName = columnName;
        this.parent = parent;
    }

    static varchar(parent:AbstractTable, name:string, size: number): Column<PgVarChar> {
        return new Column<PgVarChar>(parent, name, new PgVarChar(size));
    }

    static timestamp(parent:AbstractTable, name:string): Column<PgTimestamp> {
        return new Column<PgTimestamp>(parent, name, new PgTimestamp());
    }

    static int(parent:AbstractTable, name:string): Column<PgInteger> {
        return new Column<PgInteger>(parent, name, new PgInteger());
    }

    static decimal(parent:AbstractTable, name:string, precision: number, scale: number): Column<PgBigDecimal> {
        return new Column<PgBigDecimal>(parent, name, new PgBigDecimal(precision, scale));
    }

    static time(parent:AbstractTable, name:string): Column<PgTime> {
        return new Column<PgTime>(parent, name, new PgTime());
    }

    static bool(parent:AbstractTable, name:string): Column<PgBoolean> {
        return new Column<PgBoolean>(parent, name, new PgBoolean());
    }

    static text(parent:AbstractTable, name:string): Column<PgText> {
        return new Column<PgText>(parent, name, new PgText());
    }

    getAlias(): string {
        return this.parent.tableName().replace(".", "_") + "_" + this.columnName;
    }

    getParent(): AbstractTable {
        return this.parent;
    }

    references(column: Column<T>): Column<T> {
        this.referenced = column;
        return this;
    }

    isNullable() {
        this.isNullableFlag = true;
        return this;
    }

    defaultValue(value: any) {
        this.defaultValueParam = value;
        return this;
    }

    autoIncrement() {
        this.autoIncrementFlag = true;
        return this;
    }

    primaryKey() {
        this.primaryKeyName = this.parent.tableName() + "_" + this.columnName;
        return this;
    }

    unique() {
        this.uniqueKeyName = this.columnName;
        return this;
    }

    isAutoIncrement(): boolean {
        return this.autoIncrementFlag;
    }

    getIsNullable(): boolean {
        return this.isNullableFlag;
    }

    getColumnName(): string {
        return this.columnName;
    }

    getReferenced(): Column<T> {
        return this.referenced;
    }

    getColumnType(): T {
        return this.columnType;
    }

    getDefaultValue(): any {
        return this.defaultValueParam;
    }
}