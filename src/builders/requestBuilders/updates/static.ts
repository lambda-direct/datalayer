import Column from '../../../columns/column';
import ColumnType from '../../../columns/types/columnType';
import Combine from './combine';
import SetObject from './setObjects';
import UpdateExpr from './updates';

export const set = <T extends ColumnType>(column: Column<T>,
  value: any): UpdateExpr => new SetObject(column.columnName, value);

export const combine = (updates: Array<UpdateExpr>): UpdateExpr => new Combine(updates);
