import { Select } from "../builders/select/select";
import { Pool } from "pg";
import { Column } from "../columns/column";
import { PgVarChar } from "../columns/types/pgVarChar";

export abstract class AbstractTable<K = any> {
    private _pool: Pool;

    protected varchar(name: string, size: number): Column<PgVarChar> {
        return Column.varchar(this, name, size);
    }

    // Should provide Pool or specific class for it?
    withConnection(connection: Pool) {
        this._pool = connection;
    }

    async select(): Promise<Array<K>> {
        const query: string = Select.from(this).build();
        const result = await this._pool!.query(query);

        const response: Array<K> = []
        for (const row of result.rows) {
            const mappedRow = this.map(new RowMapper(row));
            response.push(mappedRow);
        }

        return response;
    }

    abstract tableName(): string;

    protected abstract map(response: RowMapper): K; 
}

export class RowMapper {
    private row: any

    constructor(row: any){
        this.row = row;
    }

    getVarchar(column: Column<PgVarChar>): string{
        return this.row[column.getAlias()];
    }
}