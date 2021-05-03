import { ColumnType } from "./types/columnType";
import { PgVarChar } from "./types/pgVarChar";

export class Column<T extends ColumnType> {
    columnType: T;
    columnName: string;

    private constructor(columnName: string, columnType: T){
        this.columnType = columnType;
        this.columnName = columnName;
    }

    static varchar(name:string, size: number): Column<PgVarChar> {
        return new Column<PgVarChar>(name, new PgVarChar(size));
    }
}