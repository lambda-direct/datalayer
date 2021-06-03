import { Pool, QueryResult } from "pg";
import { ColumnType } from "../columns/types/columnType";
import { AbstractTable, RowMapper } from "../tables/abstractTable";
import { Join } from "./join/join";
import { QueryResponseMapper } from "./requestBuilders";
import { Select } from "./select/select";
import { Expr } from "./where";

abstract class AbstractJoined<MODEL> {
    protected _table: AbstractTable<MODEL>;
    protected _pool: Pool;
    protected _filter: Expr; 

    constructor(filter: Expr, table: AbstractTable, pool: Pool) {
        this._table = table;
        this._pool = pool;
        this._filter = filter;
    }
}

export class SelectTRBWithJoin<COLUMN extends ColumnType, T1, MODEL> extends AbstractJoined<MODEL> {
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

        queryBuilder.joined([this._join])
        
        const query = queryBuilder.build();
        console.log(query)

        const result = await this._pool!.query(query);
    
        const parent: AbstractTable<T1>  = this._join.joinTable;

        const response = QueryResponseMapper.map(this._table, result);
        const objects = QueryResponseMapper.map(parent, result);

        return new SelectResponseJoin(response, objects);
    }
}

export class SelectTRBWithTwoJoins<COLUMN extends ColumnType, T1, T2, MODEL> extends AbstractJoined<MODEL> {
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

        const response = QueryResponseMapper.map(this._table, result);
        const objects = QueryResponseMapper.map(parent, result);
        const objectsTwo = QueryResponseMapper.map(parentTwo, result);

        return new SelectResponseTwoJoins(response, objects, objectsTwo);
    }
}

export class SelectResponseTwoJoins<T1, T2, T3> {
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

export class SelectResponseJoin<MODEL, T2> { 
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
}