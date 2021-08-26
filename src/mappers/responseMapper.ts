import { QueryResult } from 'pg';
import { Column } from '../columns/column';
import ColumnType from '../columns/types/columnType';
import { ExtractModel } from '../tables/inferTypes';

export default class QueryResponseMapper {
  public static map = <IColumn>(mappedServiceToDb: { [name in keyof ExtractModel<IColumn>]
    : Column<ColumnType>; },
    queryResult: QueryResult<any>) => {
    const response: Array<ExtractModel<IColumn>> = [];

    queryResult.rows.forEach((row) => {
      const mappedRow: ExtractModel<IColumn> = {} as ExtractModel<IColumn>;

      Object.keys(mappedServiceToDb).forEach((key) => {
        const column = mappedServiceToDb[key as keyof ExtractModel<IColumn>];
        // eslint-disable-next-line max-len
        mappedRow[key as keyof ExtractModel<IColumn>] = column.columnType.selectStrategy(row[column.getAlias()]) as any;
      });
      response.push(mappedRow);
    });
    return response;
  };
}
