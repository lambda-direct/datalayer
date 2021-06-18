import { ColumnType } from "./columnType";

export class PgTime extends ColumnType {
    dbName: string;

    constructor() {
        super();
        this.dbName = "time without time zone";
    }

    getDbName(): string {
        return this.dbName;
    }

    insertStrategy(value: any): string {
        return value.toISOString()
    }
}