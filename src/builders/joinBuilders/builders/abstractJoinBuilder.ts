import { Column } from '../../../columns/column';
import ColumnType from '../../../columns/types/columnType';
import Session from '../../../db/session';
import { ExtractModel } from '../../../tables/inferTypes';
import Expr from '../../requestBuilders/where/where';

export default abstract class AbstractJoined<K> {
  protected _tableName: string;
  protected _session: Session;
  protected _filter: Expr;
  protected _props: {limit?:number, offset?:number};
  protected _columns: { [name in keyof ExtractModel<K>]: Column<ColumnType>; };

  public constructor(filter: Expr,
    tableName: string,
    session: Session,
    columns: { [name in keyof ExtractModel<K>]: Column<ColumnType>; },
    props: {limit?:number, offset?:number}) {
    this._tableName = tableName;
    this._session = session;
    this._filter = filter;
    this._columns = columns;
    this._props = props;
  }
}
