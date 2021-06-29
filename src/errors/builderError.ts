import Expr from '../builders/requestBuilders/where/where';
import { Column } from '../columns';
import ColumnType from '../columns/types/columnType';

export enum BuilderType{
  SELECT,
  JOINED_SELECT,
  TWO_JOINED_SELECT,
  DELETE,
  INSERT,
  UPDATE,
}

export default class BuilderError extends Error {
  public constructor(
    builderType: BuilderType,
    tableName: string,
    columns: Column<ColumnType, {}>[],
    reason: Error,
    filter?: Expr,
  ) {
    super('');
    this.message = ` Error while building select query from ${tableName}\n-----\nIf you see current error, please create [github issue](https://github.com/lambda-direct/datalayer/issues) and provide following information\n
Reason: ${reason.message}
Query builder: ${BuilderType[builderType]}
Table name: ${tableName}
Filter query: ${filter ? filter.toQuery() : 'undefined'}
Column names: ${columns.map((column) => column.getColumnName()).join(', ')}\n-----\n`;
  }
}
