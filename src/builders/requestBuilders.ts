import { Pool, QueryResult } from "pg";
import { ColumnType } from "../columns/types/columnType";
import { AbstractTable, RowMapper } from "../tables/abstractTable";
import { Join } from "./join/join";
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
    protected mapResponse<RES>(table: AbstractTable<RES>, queryResult: QueryResult<any>) {
        const response: Array<RES> = []
        for (const row of queryResult.rows) {
            const mappedRow = table.map(new RowMapper(row));
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
        return this.mapResponse(this._table, result);
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
        return this.mapResponse(this._table, result);
    }
}

abstract class AbstractJoined<MODEL> {
    protected _table: AbstractTable<MODEL>;
    protected _pool: Pool;
    protected _filter: Expr; 

    constructor(filter: Expr, table: AbstractTable, pool: Pool) {
        this._table = table;
        this._pool = pool;
        this._filter = filter;
    }

    protected mapResponse<RES>(table: AbstractTable<RES>, queryResult: QueryResult<any>) {
        const response: Array<RES> = []
        for (const row of queryResult.rows) {
            const mappedRow = table.map(new RowMapper(row));
            response.push(mappedRow);
        }
        return response
    }
}

class SelectTRBWithJoin<COLUMN extends ColumnType, T1, MODEL> extends AbstractJoined<MODEL> {
    private _join: Join<COLUMN, T1>;

    constructor(table: AbstractTable<MODEL>, pool: Pool, filter: Expr, join: Join<COLUMN, T1>) {
        super(filter, table, pool);
        this._join = join;
    }

    join<T2>(join: Join<COLUMN, T2>): SelectTRBWithTwoJoins<COLUMN, T1, T2, MODEL>{  
        return new SelectTRBWithTwoJoins(this._table, this._pool, this._filter, this._join, join);
    }

    async execute(): Promise<SelectResponseJoin<MODEL, T1>> {
        const queryBuilder = Select.from(this._table);
        if (this._filter){
            queryBuilder.filteredBy(this._filter);
        }
        
        const query = queryBuilder.build();
        // TODO Add logger true/false for sql query logging?
        console.log(query);

        const result = await this._pool!.query(query);
    
        const parent: AbstractTable<T1>  = this._join.joinTable;

        const response = this.mapResponse(this._table, result);
        const objects = this.mapResponse(parent, result);

        return new SelectResponseJoin(response, objects);
    }
}

class SelectTRBWithTwoJoins<COLUMN extends ColumnType, T1, T2, MODEL> extends AbstractJoined<MODEL> {
    private _join1: Join<COLUMN, T1>;
    private _join2: Join<COLUMN, T2>;

    constructor(table: AbstractTable, pool: Pool, filter: Expr, join1: Join<COLUMN, T1>, join2: Join<COLUMN, T2>) {
        super(filter, table, pool);
        this._join1 = join1;
        this._join2 = join2;
    }

    async execute(): Promise<SelectResponseTwoJoins<MODEL, T1, T2>> {
        // List<Join<T, ?>> joinPropsList = Arrays.asList(join1, join2);

        const queryBuilder = Select.from(this._table);
        if (this._filter){
            queryBuilder.filteredBy(this._filter);
        }
        
        const query = queryBuilder.build();
        // TODO Add logger true/false for sql query logging?
        console.log(query);

        const result = await this._pool!.query(query);
    
        const parent: AbstractTable<T1>  = this._join1.joinTable;
        const parentTwo: AbstractTable<T2> = this._join2.joinTable;

        const response = this.mapResponse(this._table, result);
        const objects = this.mapResponse(parent, result);
        const objectsTwo = this.mapResponse(parentTwo, result);

        return new SelectResponseTwoJoins(response, objects, objectsTwo);
    }
}

class SelectResponseTwoJoins<T1, T2, T3> {
    private _t1: T1[];
    private _t2: T2[];
    private _t3: T3[];

    constructor(t1: T1[], t2: T2[], t3: T3[]) {
        this._t1 = t1;
        this._t2 = t2;
        this._t3 = t3;
    }

    public mapRes<M>(imac: (t1: T1, t2: T2, t3: T3) => M): Array<M> {
        const objects = new Array<M>();
        for (let i = 0; i < this._t1.length; i++) {
            objects.push(imac(this._t1[i], this._t2[i], this._t3[i]));
        }
        return objects;
    }
}

class SelectResponseJoin<MODEL, T2> { 
    private _t1: MODEL[];
    private _t2: T2[];

    constructor(t1: MODEL[], t2: T2[]) {
        this._t1 = t1;
        this._t2 = t2;
    }

    public mapRes<M>(imac: (t1: MODEL, t2: T2) => M): Array<M> {
        const objects = new Array<M>();
        for (let i = 0; i < this._t1.length; i++) {
            objects.push(imac(this._t1[i], this._t2[i]));
        }
        return objects;
    }

    // public mapRes<M>(imac: IMacOne<M, MODEL, T2>): Array<M> {
    //     const objects = new Array<M>();
    //     for (let i = 0; i < this._t1.length; i++) {
    //         objects.push(imac.mapRes(this._t1[i], this._t2[i]));
    //     }
    //     return objects;
    // }
}

export abstract class IMac<M, T1, T2, T3> {
    abstract mapRes(t1: T1, t2: T2, t3: T3): M;
}

export interface IMacOne<M, T1, T2> {
    mapRes(t1: T1, t2: T2): M;
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
        return this.mapResponse(this._table, result);
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
        return this.mapResponse(this._table, result);
    }
}