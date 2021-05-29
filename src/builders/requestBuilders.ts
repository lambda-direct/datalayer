import { Pool, QueryResult } from "pg";
import { AbstractTable, RowMapper } from "../tables/abstractTable";
import { Delete } from "./select/delete";
import { Insert } from "./select/insert";
import { Select } from "./select/select";
import { Update } from "./select/update";
import { UpdateExpr } from "./updates";
import { Expr } from "./where";

abstract class TableRequestBuilder<T> {
    protected _table: AbstractTable<T>;
    protected _pool: Pool;

    constructor(table: AbstractTable<T>, pool: Pool) {
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
    protected mapResponse(queryResult: QueryResult<any>) {
        const response: Array<T> = []
        for (const row of queryResult.rows) {
            const mappedRow = this._table.map(new RowMapper(row));
            response.push(mappedRow);
        }
        return response
    }
}

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
        return this.mapResponse(result);
    }
}

export class SelectTRB<T> extends TableRequestBuilder<T> {
    private _filter: Expr;

    constructor(table: AbstractTable<T>, pool: Pool) {
        super(table, pool);
    }

    where(expr: Expr): SelectTRB<T> {
        this._filter = expr;
        return this;
    }

    join(): SelectTRB<T> {
        return this;
    }

    async execute(): Promise<T[]> {
        const queryBuilder = Select.from(this._table);
        if (this._filter){
            queryBuilder.filteredBy(this._filter);
        }

        const query = queryBuilder.build();
        // TODO Add logger true/false for sql query logging?
        console.log(query);

        const result = await this._pool!.query(query);
        return this.mapResponse(result);
    }
}

export class UpdateTRB<T> extends TableRequestBuilder<T> {
    private _filter: Expr;
    private _update: UpdateExpr;

    constructor(table: AbstractTable<T>, pool: Pool) {
        super(table, pool);
    }

    where(expr: Expr): UpdateTRB<T> {
        this._filter = expr;
        return this;
    }

    set(expr: UpdateExpr): UpdateTRB<T> {
        this._update = expr;
        return this;
    }

    async execute(): Promise<T[]> {
        const query: string = Update.in(this._table).set(this._update).filteredBy(this._filter).build();
        console.log(query);

        const result = await this._pool.query(query);
        return this.mapResponse(result);
    }
}

export class DeleteTRB<T> extends TableRequestBuilder<T> {
    private _filter: Expr;

    where(expr: Expr): DeleteTRB<T> {
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

        const result = await this._pool.query(query);
        return this.mapResponse(result);
    }
}