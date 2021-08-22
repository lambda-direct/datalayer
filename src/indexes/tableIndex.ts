import { Column } from '../columns';
import ColumnType from '../columns/types/columnType';

export default class TableIndex {
  private __columns: Column<ColumnType, boolean, boolean>[];

  public constructor(columns: Column<ColumnType, boolean, boolean>[]) {
    this.__columns = columns;
  }

  public getColumns = () => this.__columns;
}
