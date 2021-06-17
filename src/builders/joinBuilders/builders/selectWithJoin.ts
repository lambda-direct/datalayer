import { Pool } from "pg";
import { ColumnType } from "../../../columns/types/columnType";
import { QueryResponseMapper } from "../../../mappers/responseMapper";
import { AbstractTable } from "../../../tables/abstractTable";
import { Select } from "../../lowLvlBuilders/select";
import { Expr } from "../../requestBuilders/where";
import { Join } from "../join";
import { SelectResponseJoin } from "../responses/SelectResponseWithJoin";
import { AbstractJoined } from "./abstractJoinBuilder";
import { SelectTRBWithTwoJoins } from "./selectWithTwoJoins";

export class SelectTRBWithJoin<COLUMN extends ColumnType, T1, MODEL, DB> extends AbstractJoined<MODEL, DB> {
    private _join: Join<COLUMN, T1,DB>;

    constructor(table: AbstractTable<MODEL, DB>, pool: Pool, filter: Expr, join: Join<COLUMN, T1, DB>) {
        super(filter, table, pool);
        this._join = join;
    }

    join<T2>(join: Join<COLUMN, T2, DB>): SelectTRBWithTwoJoins<COLUMN, T1, T2, MODEL, DB>{  
        return new SelectTRBWithTwoJoins(this._table, this._pool, this._filter, this._join, join);
    }

    async execute(): Promise<SelectResponseJoin<MODEL, T1, DB>> {
        const queryBuilder = Select.from(this._table);
        if (this._filter){
            queryBuilder.filteredBy(this._filter);
        }

        queryBuilder.joined([this._join])
        
        const query = queryBuilder.build();

        const result = await this._pool!.query(query);
    
        const parent: AbstractTable<T1, DB>  = this._join.joinTable;

        const response = QueryResponseMapper.map(this._table, result);
        const objects = QueryResponseMapper.map(parent, result);

        return new SelectResponseJoin(response, objects);
    }
}