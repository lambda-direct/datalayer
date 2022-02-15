/* eslint-disable import/no-cycle */
/* eslint-disable max-len */
/* eslint-disable max-classes-per-file */
import PgVarChar from '../columns/types/pgVarChar';
import PgTimestamp from '../columns/types/pgTimestamp';
import PgInteger from '../columns/types/pgInteger';
import PgBigDecimal from '../columns/types/pgBigDecimal';
import PgTime from '../columns/types/pgTime';
import PgBoolean from '../columns/types/pgBoolean';
import PgText from '../columns/types/pgText';
import PgJsonb from '../columns/types/pgJsonb';
import ColumnType from '../columns/types/columnType';
import InsertTRB from '../builders/highLvlBuilders/insertRequestBuilder';
import DeleteTRB from '../builders/highLvlBuilders/deleteRequestBuilder';
import UpdateTRB from '../builders/highLvlBuilders/updateRequestBuilder';
import SelectTRB from '../builders/highLvlBuilders/selectRequestBuilder';
import PgBigInt from '../columns/types/pgBigInt';
import Session from '../db/session';
import BaseLogger from '../logger/abstractLogger';
import PgEnum from '../columns/types/pgEnum';
import { ExtractModel } from './inferTypes';
import DB, { IDB } from '../db/db';
import { AbstractColumn, Column } from '../columns/column';
import TableIndex from '../indexes/tableIndex';

export default abstract class AbstractTable<TTable extends AbstractTable<TTable>> {
  private _session: Session;
  private _logger: BaseLogger | undefined;

  public constructor(db: IDB) {
    if (db instanceof DB) {
      this._session = db.session();
      this._logger = db.logger();
    }
  }

  // @TODO document, that you should not use arrow functions for abstract classes
  public abstract tableName(): string;

  public withLogger = (logger: BaseLogger) => {
    this._logger = logger;
  };

  public select = ({ limit, offset }:{
    limit?: number,
    offset?: number }
  = {}): SelectTRB<TTable> => {
    if (!this._session) {
      throw new Error(`Db was not provided in constructor, while ${this.constructor.name} class was creating. Please make sure, that you provided Db object to ${this.constructor.name} class. Should be -> new ${this.constructor.name}(db)`);
    }

    return new SelectTRB(this,
      this._session, this.mapServiceToDb(), { limit, offset }, this._logger);
  };

  public update = (): UpdateTRB<TTable> => {
    if (!this._session) {
      throw new Error(`Db was not provided in constructor, while ${this.constructor.name} class was creating. Please make sure, that you provided Db object to ${this.constructor.name} class. Should be -> new ${this.constructor.name}(db)`);
    }
    return new UpdateTRB(this, this._session, this.mapServiceToDb(), this._logger);
  };

  public insert = (value: ExtractModel<TTable>):
  InsertTRB<TTable> => {
    if (!this._session) {
      throw new Error(`Db was not provided in constructor, while ${this.constructor.name} class was creating. Please make sure, that you provided Db object to ${this.constructor.name} class. Should be -> new ${this.constructor.name}(db)`);
    }
    return new InsertTRB([value], this, this._session,
      this.mapServiceToDb(), this._logger);
  };

  public insertMany = (values: ExtractModel<TTable>[]):
  InsertTRB<TTable> => {
    if (!this._session) {
      throw new Error(`Db was not provided in constructor, while ${this.constructor.name} class was creating. Please make sure, that you provided Db object to ${this.constructor.name} class. Should be -> new ${this.constructor.name}(db)`);
    }
    return new InsertTRB(values, this, this._session,
      this.mapServiceToDb(), this._logger);
  };

  public delete = (): DeleteTRB<TTable> => {
    if (!this._session) {
      throw new Error(`Db was not provided in constructor, while ${this.constructor.name} class was creating. Please make sure, that you provided Db object to ${this.constructor.name} class. Should be -> new ${this.constructor.name}(db)`);
    }
    return new DeleteTRB(this, this._session,
      this.mapServiceToDb(), this._logger);
  };

  public mapServiceToDb(): {[name in keyof ExtractModel<TTable>]: AbstractColumn<ColumnType>} {
    return Object.getOwnPropertyNames(this)
      .reduce<{[name in keyof ExtractModel<TTable>]: AbstractColumn<ColumnType>}>((res, fieldName) => {
      const field: unknown = (this as unknown as TTable)[fieldName as keyof TTable];
      if (field instanceof AbstractColumn) {
        res[fieldName as keyof ExtractModel<TTable>] = field;
      }
      return res;
    }, {} as {[name in keyof ExtractModel<TTable>]: Column<ColumnType>});
  }

  protected index(columns: Array<Column<ColumnType, boolean, boolean>>): TableIndex
  protected index(column: Column<ColumnType, boolean, boolean>): TableIndex
  protected index(columns: any) {
    return new TableIndex(this.tableName(), [columns]);
  }

  protected varchar(name: string, params?: {size?: number, notNull: false})
  : Column<PgVarChar, true>;
  protected varchar(name: string, params: {size?: number, notNull: true})
  : Column<PgVarChar, false>;
  protected varchar(name: string, params?: {size?: number, notNull?: false})
  : Column<PgVarChar, true>;
  protected varchar(name: string, params: {size?: number, notNull?: true})
  : Column<PgVarChar, false>;
  protected varchar(name: string, params: {size?: number, notNull?: boolean} = {}) {
    return new Column(this.tableName(), name, new PgVarChar(params.size),
      !params?.notNull ?? false);
  }

  protected int(name: string, params?: {notNull: false}): Column<PgInteger, true>;
  protected int(name: string, params: {notNull: true}): Column<PgInteger, false>;
  protected int(name: string, params: {notNull?: boolean} = {}) {
    return new Column(this.tableName(), name, new PgInteger(), !params?.notNull ?? false);
  }

  protected timestamp(name: string, params?: { notNull: false }): Column<PgTimestamp, true>;
  protected timestamp(name: string, params: { notNull: true }): Column<PgTimestamp, false>;
  protected timestamp(name: string, params: { notNull?: boolean } = {}) {
    return new Column(this.tableName(), name, new PgTimestamp(), !params?.notNull ?? false);
  }

  protected bigint(name: string, params?: {notNull: false}): Column<PgBigInt, true>;
  protected bigint(name: string, params: {notNull: true}): Column<PgBigInt, false>;
  protected bigint(name: string, params: {notNull?: boolean} = {}) {
    return new Column(this.tableName(), name, new PgBigInt(), !params?.notNull ?? false);
  }

  protected enum<TSubType extends { [s: number]: string }>(from: { [s: number]: string },
    name: string, dbName:string, params?: {notNull: false})
  : Column<PgEnum<TSubType>, true>;
  protected enum<TSubType extends { [s: number]: string }>(from: { [s: number]: string },
    name: string, dbName:string, params: {notNull: true})
  : Column<PgEnum<TSubType>, false>;
  protected enum<TSubType extends { [s: number]: string }>(from: { [s: number]: string },
    name: string, dbName:string, params: {notNull?: boolean} = {}) {
    return new Column(this.tableName(), name,
      new PgEnum<TSubType>(name, dbName, from as TSubType), !params?.notNull ?? false);
  }

  protected decimal(name: string, params?: {notNull: false, precision: number, scale: number})
  : Column<PgBigDecimal, true>;
  protected decimal(name: string, params: {notNull: true, precision: number, scale: number})
  : Column<PgBigDecimal, false>;
  protected decimal(name: string, params: {notNull?: boolean,
    precision?: number, scale?: number} = {}) {
    return new Column(this.tableName(), name,
      new PgBigDecimal(params.precision, params.scale), !params?.notNull ?? false);
  }

  protected time(name: string, params?: {notNull: false}): Column<PgTime, true>;
  protected time(name: string, params: {notNull: true}): Column<PgTime, false>;
  protected time(name: string, params: {notNull?: boolean} = {}) {
    return new Column(this.tableName(), name, new PgTime(), !params?.notNull ?? false);
  }

  protected bool(name: string, params?: {notNull: false}): Column<PgBoolean, true>;
  protected bool(name: string, params: {notNull: true}): Column<PgBoolean, false>;
  protected bool(name: string, params: {notNull?: boolean} = {}) {
    return new Column(this.tableName(), name, new PgBoolean(), !params?.notNull ?? false);
  }

  protected text(name: string, params?: {notNull: false}): Column<PgText, true>;
  protected text(name: string, params: {notNull: true}): Column<PgText, false>;
  protected text(name: string, params: {notNull?: boolean} = {}) {
    return new Column(this.tableName(), name, new PgText(), !params?.notNull ?? false);
  }

  protected jsonb<TSubType>(name: string, params?: {notNull: false})
  : Column<PgJsonb<TSubType>, true>;
  protected jsonb<TSubType>(name: string, params: {notNull: true})
  : Column<PgJsonb<TSubType>, false>;
  protected jsonb<TSubType>(name: string, params: {notNull?: boolean} = {}) {
    return new Column(this.tableName(), name,
      new PgJsonb<TSubType>(), !params?.notNull ?? false);
  }
}
