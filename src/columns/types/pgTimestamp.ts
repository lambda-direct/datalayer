import { ColumnType } from "./columnType";

export class PgTimestamp extends ColumnType {
    dbName: string;

    constructor(){
        super();
        this.dbName = "timestamp without time zone"
    }
}