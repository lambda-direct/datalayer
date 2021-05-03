import { Select } from "@/builders/select/select";
import { Column } from "@/columns/column";
import { Pool } from "pg";

export abstract class AbstractTable {
    private _pool: Pool;

    protected varchar(name: string, size: number) {
        return Column.varchar(name, size);
    }

    // Should provide Pool or specific class for it?
    withConnection(connection: Pool) {
        this._pool = connection;
    }

    async select() {
        const query: string = Select.from(this).build();
        console.log(query);
        const result = await this._pool.query(query);
        return result;
    }

    abstract tableName(): string;
}