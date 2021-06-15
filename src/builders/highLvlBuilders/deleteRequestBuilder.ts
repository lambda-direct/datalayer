import { QueryResponseMapper } from "../../mappers/responseMapper";
import { Delete } from "../lowLvlBuilders/delete";
import { Expr } from "../requestBuilders/where";
import { TableRequestBuilder } from "./abstractRequestBuilder";

export class DeleteTRB<T, DB> extends TableRequestBuilder<T, DB> {
    private _filter: Expr;

    where(expr: Expr): DeleteTRB<T, DB> {
        this._filter = expr;
        return this;
    }

    async returningAll() {
        return this.execute();
    }

    protected async execute(): Promise<T[]> {
        const queryBuilder = Delete.from(this._table);
        if (this._filter){
            queryBuilder.filteredBy(this._filter);
        }

        const query = queryBuilder.build();
        console.log('DELETE: ', query)

        const result = await this._pool.query(query);
        return QueryResponseMapper.map(this._table, result);
    }
}