import Column from '../../../columns/column';
import ColumnType from '../../../columns/types/columnType';
import Const from './const';
import EqWhere from './eqWhere';
import Var from './var';
import Expr from './where';

const eq = <T extends ColumnType>(left: Column<T>,
  value: any): Expr => new EqWhere(new Var<T>(left), new Const(value));

export default eq;
