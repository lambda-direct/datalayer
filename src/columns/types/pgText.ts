import { ColumnType } from "./columnType";

export class PgText extends ColumnType {
    dbName: string;

    constructor() {
        super();
        this.dbName = "TEXT";
    }

    getDbName(): string {
        return this.dbName;
    }
}