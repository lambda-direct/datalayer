import { ColumnType } from "./columnType";

export class PgVarChar extends ColumnType {
    size: number;
    dbName: string;

    constructor(size: number){
        super();
        this.size = size;
        this.dbName = `character varying(${this.size})`
    }
}