import { Pool, QueryResult } from "pg";
import { ColumnType } from "../columns/types/columnType";
import { AbstractTable, RowMapper } from "../tables/abstractTable";
import { Join } from "./join/join";
import { SelectTRBWithJoin } from "./joinBuilders";
import { Delete } from "./select/delete";
import { Insert } from "./select/insert";
import { Select } from "./select/select";
import { Update } from "./select/update";
import { UpdateExpr } from "./updates";
import { Expr } from "./where";


export abstract class QueryResponseMapper {
    static map<RES>(table: AbstractTable<RES>, queryResult: QueryResult<any>) {
        const response: Array<RES> = []
        for (const row of queryResult.rows) {
            const mappedRow = table.map(new RowMapper(row));
            response.push(mappedRow);
        }
        return response
    }
}

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
        return QueryResponseMapper.map(this._table, result);
    }
}

export class SelectTRB<MODEL> extends TableRequestBuilder<MODEL> {
    protected _filter: Expr;

    constructor(table: AbstractTable<MODEL>, pool: Pool) {
        super(table, pool);
    }

    where(expr: Expr): SelectTRB<MODEL> {
        this._filter = expr;
        return this;
    }

    join<COLUMN extends ColumnType, T1>(join: Join<COLUMN, T1>): SelectTRBWithJoin<COLUMN, T1, MODEL>{  
        if(join.toColumn.getParent() === this._table) {
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
        console.log(query);

        const result = await this._pool!.query(query);
        return QueryResponseMapper.map(this._table, result);
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
        return QueryResponseMapper.map(this._table, result);
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
        return QueryResponseMapper.map(this._table, result);
    }
}