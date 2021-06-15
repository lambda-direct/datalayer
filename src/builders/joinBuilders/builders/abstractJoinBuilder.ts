import { Pool } from "pg";
import { AbstractTable } from "../../../tables/abstractTable";
import { Expr } from "../../requestBuilders/where";

export abstract class AbstractJoined<MODEL, DB> {
    protected _table: AbstractTable<MODEL, DB>;
    protected _pool: Pool;
    protected _filter: Expr; 

    constructor(filter: Expr, table: AbstractTable<MODEL, DB>, pool: Pool) {
        this._table = table;
        this._pool = pool;
        this._filter = filter;
    }
}