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

}