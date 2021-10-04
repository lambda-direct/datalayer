import { AbstractColumn, Column } from '../../../columns/column';
import ColumnType from '../../../columns/types/columnType';
import Session from '../../../db/session';
import BaseLogger from '../../../logger/abstractLogger';
import { ExtractModel } from '../../../tables/inferTypes';
import Order from '../../highLvlBuilders/order';
import Expr from '../../requestBuilders/where/where';

export default abstract class AbstractJoined<K> {
  protected _tableName: string;
  protected _session: Session;
  protected _filter: Expr;
  protected _props: {limit?:number, offset?:number};
  protected _orderBy?: Column<ColumnType, boolean, boolean>;
  protected _order?: Order;
  protected _logger?: BaseLogger;
  protected _columns: { [name in keyof ExtractModel<K>]: Column<ColumnType>; };
  protected _distinct?: AbstractColumn<ColumnType, boolean, boolean>;

  public constructor(filter: Expr,
    tableName: string,
    session: Session,
    columns: { [name in keyof ExtractModel<K>]: Column<ColumnType>; },
    props: {limit?:number, offset?:number},
    orderBy?: Column<ColumnType, boolean, boolean>,
    order?: Order,
    logger?: BaseLogger,
    distinct?: AbstractColumn<ColumnType, boolean, boolean>) {
    this._tableName = tableName;
    this._session = session;
    this._filter = filter;
    this._columns = columns;
    this._props = props;
    this._order = order;
    this._orderBy = orderBy;
    this._logger = logger;
    this._distinct = distinct;
  }
}
