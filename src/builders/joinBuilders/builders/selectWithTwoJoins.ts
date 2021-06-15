import { Pool } from "pg";
import { ColumnType } from "../../../columns/types/columnType";
import { QueryResponseMapper } from "../../../mappers/responseMapper";
import { AbstractTable } from "../../../tables/abstractTable";
import { Select } from "../../lowLvlBuilders/select";
import { Expr } from "../../requestBuilders/where";
import { Join } from "../join";
import { SelectResponseTwoJoins } from "../responses/selectResponseTwoJoins";
import { AbstractJoined } from "./abstractJoinBuilder";

export class SelectTRBWithTwoJoins<COLUMN extends ColumnType, T1, T2, MODEL, DB> extends AbstractJoined<MODEL, DB> {
    private _join1: Join<COLUMN, T1, DB>;
    private _join2: Join<COLUMN, T2, DB>;

    constructor(table: AbstractTable<MODEL, DB>, pool: Pool, filter: Expr, join1: Join<COLUMN, T1, DB>, join2: Join<COLUMN, T2, DB>) {
        super(filter, table, pool);
        this._join1 = join1;
        this._join2 = join2;
    }

    async execute(): Promise<SelectResponseTwoJoins<MODEL, T1, T2, DB>> {
        // List<Join<T, ?>> joinPropsList = Arrays.asList(join1, join2);

        const queryBuilder = Select.from(this._table);
        if (this._filter){
            queryBuilder.filteredBy(this._filter);
        }

        queryBuilder.joined([this._join1, this._join2])
        
        const query = queryBuilder.build();

        const result = await this._pool!.query(query);
    
        const parent: AbstractTable<T1,DB>  = this._join1.joinTable;
        const parentTwo: AbstractTable<T2,DB> = this._join2.joinTable;

        const response = QueryResponseMapper.map(this._table, result);
        const objects = QueryResponseMapper.map(parent, result);
        const objectsTwo = QueryResponseMapper.map(parentTwo, result);

        return new SelectResponseTwoJoins(response, objects, objectsTwo);
    }
}