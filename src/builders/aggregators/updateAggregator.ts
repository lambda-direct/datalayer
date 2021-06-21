import AbstractTable from '../../tables/abstractTable';
import UpdateExpr from '../requestBuilders/updates/updates';
import { Expr } from '../requestBuilders/where/where';
import Aggregator from './abstractAggregator';

export default class UpdateAggregator<SERVICE> extends Aggregator<SERVICE> {
  private _updates: Array<string> = [];
  private _filters: Array<string> = [];
  private _from: Array<string> = [];
  private _update: Array<string> = ['UPDATE'];

  public constructor(table: AbstractTable<SERVICE>) {
    super(table);
  }

  public where = (filters: Expr): UpdateAggregator<SERVICE> => {
    this._filters.push('WHERE ');
    this._filters.push(filters.toQuery());
    return this;
  };

  public appendFrom = (table: AbstractTable<SERVICE>): UpdateAggregator<SERVICE> => {
    this._from.push(' ');
    this._from.push(table.tableName());
    return this;
  };

  public set = (updates: UpdateExpr): UpdateAggregator<SERVICE> => {
    this._updates.push(`\nSET ${updates.toQuery()}`);
    return this;
  };

  public buildQuery = () => {
    this._update.push(this._from.join(''));
    this._update.push('\n');
    this._update.push(this._updates.join(''));
    this._update.push('\n');
    this._update.push(this._filters.join(''));
    this._update.push('\n');
    this._update.push('RETURNING');
    this._update.push('\n');
    this._update.push(this._fields.join(''));

    return this._update.join('');
  };
}
