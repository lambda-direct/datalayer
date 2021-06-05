import { QueryResult } from "pg";
import { AbstractTable, RowMapper } from "../tables/abstractTable";

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