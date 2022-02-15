import { QueryResult } from 'pg';
import { AbstractColumn } from '../columns/column';
import ColumnType from '../columns/types/columnType';
import { ExtractModel } from '../tables/inferTypes';

export default class QueryResponseMapper {
  public static map = <ITable>(mappedServiceToDb: { [name in keyof ExtractModel<ITable>]
    : AbstractColumn<ColumnType>; },
    queryResult: QueryResult<any>, joinId?: number) => {
    const response: Array<ExtractModel<ITable>> = [];

    queryResult.rows.forEach((row) => {
      const mappedRow: ExtractModel<ITable> = {} as ExtractModel<ITable>;

      Object.keys(mappedServiceToDb).forEach((key) => {
        const column = mappedServiceToDb[key as keyof ExtractModel<ITable>];
        const alias = `${column.getAlias()}${joinId ? `_${joinId}` : ''}`;
        const value = column.getColumnType().selectStrategy(row[alias]) as any;
        mappedRow[key as keyof ExtractModel<ITable>] = value === null ? undefined : value;
      });
      response.push(mappedRow);
    });
    return response;
  };
}
