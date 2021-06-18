import { QueryResult } from "pg";
import { AbstractTable, RowMapper } from "../tables/abstractTable";

export abstract class QueryResponseMapper {
    static map<RES>(table: AbstractTable<RES>, queryResult: QueryResult<any>) {
        const response: Array<RES> = []
        for (const row of queryResult.rows) {
            const mappedRow: RES = {} as RES
            const mapped = table.mapServiceToDb();

            for (let key of Object.keys(mapped)){
                const column = mapped[key as keyof RES];
                mappedRow[key as keyof RES] = row[column.getAlias()];
            }

            response.push(mappedRow);
        }
        return response
    }
}