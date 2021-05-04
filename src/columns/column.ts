import { AbstractTable } from "../tables/abstractTable";
import { ColumnType } from "./types/columnType";
import { PgVarChar } from "./types/pgVarChar";

export class Column<T extends ColumnType> {
    private parent: AbstractTable;

    columnType: T;
    columnName: string;

    private constructor(parent: AbstractTable, columnName: string, columnType: T){
        this.columnType = columnType;
        this.columnName = columnName;
        this.parent = parent;
    }

    static varchar(parent:AbstractTable, name:string, size: number): Column<PgVarChar> {
        return new Column<PgVarChar>(parent, name, new PgVarChar(size));
    }

    getAlias(): string{
        return this.parent.tableName().replace(".", "_") + "_" + this.columnName;
    }

    getParent(): AbstractTable {
        return this.parent;
    }

}