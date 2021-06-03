import { ColumnType } from "./columnType";

export class PgNumber extends ColumnType {
    dbName: string;

    constructor(){
        super();
        this.dbName = "INT"
    }
}