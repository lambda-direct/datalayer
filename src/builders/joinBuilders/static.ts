import ColumnType from '../../columns/types/columnType';
import AbstractTable from '../../tables/abstractTable';
import JoinWith from './joinWith';

const to = <COLUMN extends ColumnType, MODEL>(table: AbstractTable<MODEL>):
JoinWith<COLUMN, MODEL> => new JoinWith(table.tableName(), table.mapServiceToDb());

// eslint-disable-next-line import/prefer-default-export
export default to;
