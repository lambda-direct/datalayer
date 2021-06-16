import { Pool } from "pg";
import { ColumnType } from "../../columns/types/columnType";
import { QueryResponseMapper } from "../../mappers/responseMapper";
import { AbstractTable } from "../../tables/abstractTable";
import { SelectTRBWithJoin } from "../joinBuilders";
import { Join } from "../joinBuilders/join";
import { Select } from "../lowLvlBuilders/select";
import { Expr } from "../requestBuilders/where";
import { TableRequestBuilder } from "./abstractRequestBuilder";

export class SelectTRB<MODEL, DB> extends TableRequestBuilder<MODEL, DB> {
    protected _filter: Expr;

    constructor(table: AbstractTable<MODEL, DB>, pool: Pool) {
        super(table, pool);
    }

    where(expr: Expr): SelectTRB<MODEL, DB> {
        this._filter = expr;
        return this;
    }

    join<COLUMN extends ColumnType, T1>(join: Join<COLUMN, T1, {}>): SelectTRBWithJoin<COLUMN, T1, MODEL, {}>{  
        if (join.toColumn.getParent() === this._table) {
            throw Error('We are not supporting self joining in this version');
        }
        return new SelectTRBWithJoin(this._table, this._pool, this._filter, join);
    }

    async execute(): Promise<MODEL[]> {
        const queryBuilder = Select.from(this._table);
        if (this._filter){
            queryBuilder.filteredBy(this._filter);
        }

        const query = queryBuilder.build();
        // TODO Add logger true/false for sql query logging?
        console.log('SELECT: ', query)

        const result = await this._pool!.query(query);
        return QueryResponseMapper.map(this._table, result);
    }
}