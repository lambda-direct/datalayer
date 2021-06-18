import { ColumnType } from "./columnType";

export class PgJsonb extends ColumnType {
    dbName: string;

    constructor() {
        super();
        this.dbName = "JSONB";
    }

    getDbName(): string {
        return this.dbName;
    }

    insertStrategy(value: any): string {
        return `'${JSON.stringify(value)}'::jsonb`
    }
}