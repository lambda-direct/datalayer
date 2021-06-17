import { Pool } from "pg";
import { QueryResponseMapper } from "../../mappers/responseMapper";
import { AbstractTable } from "../../tables/abstractTable";
import { Update } from "../lowLvlBuilders/update";
import { UpdateExpr } from "../requestBuilders/updates";
import { Expr } from "../requestBuilders/where";
import { TableRequestBuilder } from "./abstractRequestBuilder";

export class UpdateTRB<T, DB> extends TableRequestBuilder<T, DB> {
    private _filter: Expr;
    private _update: UpdateExpr;

    constructor(table: AbstractTable<T, DB>, pool: Pool) {
        super(table, pool);
    }

    where(expr: Expr): UpdateTRB<T, DB> {
        this._filter = expr;
        return this;
    }

    set(expr: UpdateExpr): UpdateTRB<T, DB> {
        this._update = expr;
        return this;
    }

    async execute(): Promise<T[]> {
        const query: string = Update.in(this._table).set(this._update).filteredBy(this._filter).build();

        const result = await this._pool.query(query);
        return QueryResponseMapper.map(this._table, result);
    }
}