import { QueryResult } from 'pg';
import Column from '../columns/column';
import ColumnType from '../columns/types/columnType';

export default abstract class QueryResponseMapper {
  public static map = <RES>(mappedServiceToDb: { [name in keyof RES]: Column<ColumnType, {}>; },
    queryResult: QueryResult<any>) => {
    const response: Array<RES> = [];

    queryResult.rows.forEach((row) => {
      const mappedRow: RES = {} as RES;

      Object.keys(mappedServiceToDb).forEach((key) => {
        const column = mappedServiceToDb[key as keyof RES];
        mappedRow[key as keyof RES] = row[column.getAlias()];
      });
      response.push(mappedRow);
    });
    return response;
  };
}
