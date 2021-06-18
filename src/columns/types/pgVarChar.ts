import { ColumnType } from "./columnType";

export class PgVarChar extends ColumnType {
    protected size: number;
    protected dbName: string;

    constructor(size: number) {
        super();
        this.size = size;
        this.dbName = `character varying(${this.size})`
    }

    getDbName(): string {
        return this.dbName;
    }

    insertStrategy(value: any): string {
        return `'${value.replace("'", "''")}'`
    }
}