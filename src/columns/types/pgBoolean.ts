import { ColumnType } from "./columnType";

export class PgBoolean extends ColumnType {
    dbName: string;

    constructor() {
        super();
        this.dbName = "boolean";
    }

    getDbName(): string {
        return this.dbName;
    }

    insertStrategy(value: any): string {
        return `${value}`
    }
}