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
        
        const mappedRows: {[name: string]: any}[] = []
        const mapper = this._table.mapServiceToDb()
        for (const valueToInsert of this._values) {
            const mappedValue: {[name: string]: any} = {}
            for (let [key, value] of Object.entries(valueToInsert)){
                const column = mapper[key as keyof T];
                mappedValue[column.columnName] = value
            }
            mappedRows.push(mappedValue);
        }

        console.log(mappedRows)

        const query = queryBuilder.values(mappedRows).build();
        console.log(query)
        const result = await this._pool!.query(query);
        return QueryResponseMapper.map(this._table, result);
    }
}