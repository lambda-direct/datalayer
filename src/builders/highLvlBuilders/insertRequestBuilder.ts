import { Pool } from "pg";
import { QueryResponseMapper } from "../../mappers/responseMapper";
import { AbstractTable } from "../../tables/abstractTable";
import { Insert } from "../lowLvlBuilders/insert";
import { TableRequestBuilder } from "./abstractRequestBuilder";

export class InsertTRB<T, DB> extends TableRequestBuilder<T, DB> {
    private _values: T[];

    constructor(values: T[], table: AbstractTable<T, DB>, pool: Pool) {
        super(table, pool);
        this._values = values;
    }

    async returningAll() {
        return this.execute();
    }

    protected async execute(): Promise<T[]> {
        const queryBuilder = Insert.into(this._table);
        if(!this._values) throw Error('Values should be provided firestly\nExample: table.values().execute()');
        const valuesToInsert = this._values.map(this._table.toDbModel);
        // const valuesToInsert1 = this._values;
        
        // const mapper = this._table.toTest()
        // for (let key of Object.keys(valuesToInsert1)){
        //     const column = mapper[key as keyof T];
        //     // дальше по колонке решать как инсертить или что-то делать
        // }

        const query = queryBuilder.values(valuesToInsert).build();
        console.log(query)
        const result = await this._pool!.query(query);
        return QueryResponseMapper.map(this._table, result);
    }
}