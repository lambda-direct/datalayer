import Column from '../../../columns/column';
import ColumnType from '../../../columns/types/columnType';
import { ecranate } from '../../../utils/ecranate';
import Expr from './where';

export default class Var<T extends ColumnType> extends Expr {
  private column: Column<T>;

  public constructor(column: Column<T>) {
    super();
    this.column = column;
  }

  public toQuery = (): string => `${this.column.getParent().tableName()}.${ecranate(this.column.columnName)}`;
}
