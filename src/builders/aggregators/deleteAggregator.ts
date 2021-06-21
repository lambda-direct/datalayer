import AbstractTable from '../../tables/abstractTable';
import Expr from '../requestBuilders/where/where';
import Aggregator from './abstractAggregator';

export default class DeleteAggregator<SERVICE> extends Aggregator<SERVICE> {
  private _from: Array<string> = [];
  private _filters: Array<string> = [];
  private _delete: Array<string> = ['DELETE'];

  public constructor(table: AbstractTable<SERVICE>) {
    super(table);
  }

  public filters = (filters: Expr): DeleteAggregator<SERVICE> => {
    this._filters.push('WHERE ');
    this._filters.push(filters.toQuery());
    return this;
  };

  public appendFrom = (table: AbstractTable<SERVICE>): DeleteAggregator<SERVICE> => {
    this._from.push(' FROM ');
    this._from.push(table.tableName());
    return this;
  };

  public buildQuery = () => {
    // this._delete.push(this._fields.join(''));
    this._delete.push('\n');
    this._delete.push(this._from.join(''));
    this._delete.push('\n');
    this._delete.push(this._filters.join(''));

    return this._delete.join('');
  };
}
