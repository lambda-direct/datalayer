import { Select } from "../builders/select/select";
import { Pool } from "pg";
import { Column } from "../columns/column";
import { PgVarChar } from "../columns/types/pgVarChar";
import { Expr } from "../builders/where";
import { UpdateExpr, Updates } from "../builders/updates";
import { Update } from '../builders/select/update';
import { Insert } from "../builders/select/insert";

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

class InsertTRB<T> extends TableRequestBuilder<T> {
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

        const response: Array<T> = []
        for (const row of result.rows) {
            const mappedRow = this._table.map(new RowMapper(row));
            response.push(mappedRow);
        }

        return response;
    }
}

class SelectTRB<T> extends TableRequestBuilder<T> {
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

        // TODO Make logic abstract, for all queries. Need to check all queries firstly
        const response: Array<T> = []
        for (const row of result.rows) {
            const mappedRow = this._table.map(new RowMapper(row));
            response.push(mappedRow);
        }

        return response;
    }
}

class UpdateTRB<T> extends TableRequestBuilder<T> {
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

        const response: Array<T> = []
        for (const row of result.rows) {
            const mappedRow = this._table.map(new RowMapper(row));
            response.push(mappedRow);
        }

        return response;
    }
}

export abstract class AbstractTable<K = any> {
    private _pool: Pool;

    protected varchar({name, size}: {name: string, size: number}): Column<PgVarChar> {
        return Column.varchar(this, name, size);
    }

    withConnection(connection: Pool) {
        this._pool = connection;
    }

    select(): SelectTRB<K> {
        return new SelectTRB(this, this._pool);
    }

    update(): UpdateTRB<K>{
        return new UpdateTRB(this, this._pool);
    }

    insert(values: K[]): InsertTRB<K>{
        return new InsertTRB(values, this, this._pool)
    }

    abstract tableName(): string;

    abstract map(response: RowMapper): K; 
}

export class RowMapper {
    private row: any

    constructor(row: any){
        this.row = row;
    }

    getVarchar(column: Column<PgVarChar>): string{
        return this.row[column.getAlias()];
    }
}