import { Pool } from "pg";
import { QueryResponseMapper } from "../../mappers/responseMapper";
import { AbstractTable } from "../../tables/abstractTable";
import { Insert } from "../lowLvlBuilders/insert";
import { TableRequestBuilder } from "./abstractRequestBuilder";

export class InsertTRB<T> extends TableRequestBuilder<T> {
    private _values: T[];

    constructor(values: T[], table: AbstractTable<T>, pool: Pool) {
        super(table, pool);
        this._values = values;
    }

    async returningAll() {
        return this.execute();
    }

    protected async execute(): Promise<T[]> {
        const queryBuilder = Insert.into(this._table);
        if(!this._values) throw Error('Values should be provided firestly\nExample: table.values().execute()');

        const query = queryBuilder.values(this._values).build();

        const result = await this._pool!.query(query);
        return QueryResponseMapper.map(this._table, result);
    }
}