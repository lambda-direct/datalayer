import { QueryResult } from 'pg';
import AbstractTable from '../tables/abstractTable';

export default abstract class QueryResponseMapper {
  public static map = <RES>(table: AbstractTable<RES>, queryResult: QueryResult<any>) => {
    const response: Array<RES> = [];

    queryResult.rows.forEach((row) => {
      const mappedRow: RES = {} as RES;
      const mapped = table.mapServiceToDb();

      Object.keys(mapped).forEach((key) => {
        const column = mapped[key as keyof RES];
        mappedRow[key as keyof RES] = row[column.getAlias()];
      });
      response.push(mappedRow);
    });
    return response;
  };
}
