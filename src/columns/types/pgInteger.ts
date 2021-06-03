import { ColumnType } from "./columnType";

export class PgInteger extends ColumnType {
    dbName: string;

    constructor() {
        super();
        this.dbName = `INT`;
    }
}