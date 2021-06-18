import { ColumnType } from "./columnType";

export class PgInteger extends ColumnType {
    dbName: string;

    constructor() {
        super();
        this.dbName = "INT";
    }

    getDbName(): string {
        return this.dbName;
    }

    insertStrategy(value: any): string {
        return `${value}`;
    }
}