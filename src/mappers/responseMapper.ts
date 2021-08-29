import { QueryResult } from 'pg';
import { AbstractColumn } from '../columns/column';
import ColumnType from '../columns/types/columnType';
import { ExtractModel } from '../tables/inferTypes';

export default class QueryResponseMapper {
  public static map = <ITable>(mappedServiceToDb: { [name in keyof ExtractModel<ITable>]
    : AbstractColumn<ColumnType>; },
    queryResult: QueryResult<any>) => {
    const response: Array<ExtractModel<ITable>> = [];

    queryResult.rows.forEach((row) => {
      const mappedRow: ExtractModel<ITable> = {} as ExtractModel<ITable>;

      Object.keys(mappedServiceToDb).forEach((key) => {
        const column = mappedServiceToDb[key as keyof ExtractModel<ITable>];
        // eslint-disable-next-line max-len
        mappedRow[key as keyof ExtractModel<ITable>] = column.getColumnType().selectStrategy(row[column.getAlias()]) as any;
      });
      response.push(mappedRow);
    });
    return response;
  };
}
