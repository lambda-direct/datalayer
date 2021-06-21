import Column from '../../columns/column';
import ColumnType from '../../columns/types/columnType';
import Join from '../joinBuilders/join';
import Expr from '../requestBuilders/where/where';
import Aggregator from './abstractAggregator';

export default class SelectAggregator extends Aggregator {
  private _from: Array<string> = [];
  private _filters: Array<string> = [];
  private _select: Array<string> = ['SELECT'];
  private _join: Array<string> = [];

  public constructor(tableName: string) {
    super(tableName);
  }

  public filters = (filters: Expr): SelectAggregator => {
    this._filters.push('WHERE ');
    this._filters.push(filters.toQuery());
    return this;
  };

  public appendFrom = (tableName: string): SelectAggregator => {
    this._from.push(' FROM ');
    this._from.push(tableName);
    return this;
  };

  // Add select generator for second table also
  public join = <COLUMN extends ColumnType>(joins: Array<Join<COLUMN,
  {}>>,
    columns: Column<ColumnType, {}>[]): SelectAggregator => {
    joins.forEach((join: any) => {
      const tableFrom = join.fromColumn.getParent();
      const tableTo = join.toColumn.getParent();
      const { type } = join;

      const selectString = this.generateSelectArray(tableTo, columns).join('');
      this._fields.push(', ');
      this._fields.push(selectString);
      this._join.push('\n');
      this._join.push(type);
      this._join.push(' ');
      this._join.push(tableTo.tableName());
      this._join.push('\n');
      this._join.push('ON ');
      this._join.push(tableFrom.tableName());
      this._join.push('.');
      this._join.push(join.fromColumn.columnName);
      this._join.push(' = ');
      this._join.push(tableTo.tableName());
      this._join.push('.');
      this._join.push(join.toColumn.columnName);
    });

    return this;
  };

  public buildQuery = () => {
    this._select.push(this._fields.join(''));
    this._select.push('\n');
    this._select.push(this._from.join(''));
    this._select.push('\n');
    this._select.push(this._join.join(''));
    this._select.push('\n');
    this._select.push(this._filters.join(''));

    return this._select.join('');
  };
}
