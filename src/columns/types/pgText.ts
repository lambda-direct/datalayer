import { ColumnType } from "./columnType";

export class PgText extends ColumnType {
    protected dbName: string;

    constructor() {
        super();
        this.dbName = "TEXT";
    }

    getDbName(): string {
        return this.dbName;
    }

    insertStrategy(value: any): string {
        return `'${value.replace("'", "''")}'`
    }
}