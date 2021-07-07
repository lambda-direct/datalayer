import { QueryResult } from 'pg';
import Column from '../columns/column';
import ColumnType from '../columns/types/columnType';
import { ExtractModel } from '../tables/inferTypes';

export default class QueryResponseMapper {
  public static map = <RES>(mappedServiceToDb: { [name in keyof ExtractModel<RES>]
    : Column<ColumnType>; },
    queryResult: QueryResult<any>) => {
    const response: Array<ExtractModel<RES>> = [];

    queryResult.rows.forEach((row) => {
      const mappedRow: ExtractModel<RES> = {} as ExtractModel<RES>;

      Object.keys(mappedServiceToDb).forEach((key) => {
        const column = mappedServiceToDb[key as keyof ExtractModel<RES>];
        mappedRow[key as keyof ExtractModel<RES>] = row[column.getAlias()];
      });
      response.push(mappedRow);
    });
    return response;
  };
}
