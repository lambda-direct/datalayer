import { QueryResult } from "pg";
import { AbstractTable, RowMapper } from "../tables/abstractTable";

export abstract class QueryResponseMapper {
    static map<RES, DB>(table: AbstractTable<RES, DB>, queryResult: QueryResult<any>) {
        const response: Array<RES> = []
        for (const row of queryResult.rows) {
            const mappedRow = table.toServiceModel(new RowMapper(row));
            response.push(mappedRow);
        }
        return response
    }
}