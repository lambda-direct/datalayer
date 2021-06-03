import { AbstractTable } from "../tables/abstractTable";
import { ColumnType } from "./types/columnType";
import { PgVarChar } from "./types/pgVarChar";
import { PgNumber } from "../columns/types/pgNumber";
import { PgTimestamp } from "../columns/types/pgTimestamp";

export class Column<T extends ColumnType> {
    private parent: AbstractTable;

    columnType: T;
    columnName: string;
    isNullableFlag: boolean = false;
    autoIncrementFlag: boolean = false;
    primaryKeyName: string = "";
    uniqueKeyName: string = "";

    private constructor(parent: AbstractTable, columnName: string, columnType: T){
        this.columnType = columnType;
        this.columnName = columnName;
        this.parent = parent;
    }

    static varchar(parent:AbstractTable, name:string, size: number): Column<PgVarChar> {
        return new Column<PgVarChar>(parent, name, new PgVarChar(size));
    }

    static number(parent:AbstractTable, name:string): Column<PgNumber> {
        return new Column<PgNumber>(parent, name, new PgNumber());
    }

    static timestamp(parent:AbstractTable, name:string): Column<PgTimestamp> {
        return new Column<PgTimestamp>(parent, name, new PgTimestamp());
    }

    getAlias(): string{
        return this.parent.tableName().replace(".", "_") + "_" + this.columnName;
    }

    getParent(): AbstractTable {
        return this.parent;
    }

    isNullable() {
        this.isNullableFlag = true;
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
}