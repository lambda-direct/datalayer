import Column from '../../../columns/column';
import ColumnType from '../../../columns/types/columnType';
import { ecranate } from '../../../utils/ecranate';
import Expr from './where';

export default class Var<T extends ColumnType> extends Expr {
  private column: Column<T, boolean, boolean>;

  public constructor(column: Column<T, boolean, boolean>) {
    super();
    this.column = column;
  }

  public toQuery = (): string => `${this.column.getParent()}.${ecranate(this.column.columnName)}`;
}
