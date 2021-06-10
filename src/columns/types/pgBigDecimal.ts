import { ColumnType } from "./columnType";

export class PgBigDecimal extends ColumnType {
    precision: number;
    scale: number;
    dbName: string;

    constructor(precision: number, scale: number) {
        super();
        this.precision = precision;
        this.scale = scale;
        this.dbName = `numeric(${this.precision},${this.scale})`;
    }

    getDbName(): string {
        return this.dbName;
    }
}