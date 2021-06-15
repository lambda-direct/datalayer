import { Pool } from "pg";
import { AbstractTable } from "../../tables/abstractTable";

export abstract class TableRequestBuilder<T, DB> {
    protected _table: AbstractTable<T, DB>;
    protected _pool: Pool;

    constructor(table: AbstractTable<T, DB>, pool: Pool) {
        this._table = table;
        this._pool = pool;
    }

    protected abstract execute(): Promise<Array<T>>;
    async all(): Promise<T[]> {
        return await this.execute();
    }
    async first(): Promise<T> {
        const executionRes = await this.execute();
        // TODO add checks for undefined or null
        return executionRes[0];
    }
}