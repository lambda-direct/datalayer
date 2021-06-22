import ColumnType from '../../columns/types/columnType';
import AbstractTable from '../../tables/abstractTable';
import JoinWith from './joinWith';

export const privateWith = <COLUMN extends ColumnType, MODEL>(table: AbstractTable<MODEL>):
JoinWith<COLUMN, MODEL> => new JoinWith(table.tableName(), table.mapServiceToDb());

export { privateWith as with };
