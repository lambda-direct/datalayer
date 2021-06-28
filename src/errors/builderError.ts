import Expr from '../builders/requestBuilders/where/where';
import { Column } from '../columns';
import ColumnType from '../columns/types/columnType';

export enum BuilderType{
  SELECT,
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
    this.message = `\nError, while building select query from ${tableName}\n\n-----\nIf you see current error, please create [github issue](https://github.com/lambda-direct/datalayer/issues) and provide following information\n
Reason: ${reason.message}
Query builder: ${BuilderType[builderType]}
Table name: ${tableName}
Filter query: ${filter ? filter.toQuery() : 'undefined'}
Column names: ${columns.map((column) => column.getColumnName()).join(', ')}\n-----\n`;
    this.name = 'BuilderError';
    // this.stack = (<any> new Error()).stack;
    this.stack = reason.stack;
  }
}
