import PgVarChar from '../columns/types/pgVarChar';
import PgTimestamp from '../columns/types/pgTimestamp';
import PgInteger from '../columns/types/pgInteger';
import PgBigDecimal from '../columns/types/pgBigDecimal';
import PgTime from '../columns/types/pgTime';
import PgBoolean from '../columns/types/pgBoolean';
import PgText from '../columns/types/pgText';
import PgJsonb from '../columns/types/pgJsonb';
import ColumnType from '../columns/types/columnType';
import Column from '../columns/column';

import InsertTRB from '../builders/highLvlBuilders/insertRequestBuilder';
import DeleteTRB from '../builders/highLvlBuilders/deleteRequestBuilder';
import UpdateTRB from '../builders/highLvlBuilders/updateRequestBuilder';
import SelectTRB from '../builders/highLvlBuilders/selectRequestBuilder';
import PgBigInt from '../columns/types/pgBigInt';
import Session from '../db/session';
import BaseLogger from '../logger/abstractLogger';
import PgEnum from '../columns/types/pgEnum';
import { ExtractModel } from './inferTypes';
import DB from '../db/db';

type Stub = {};

export default abstract class AbstractTable<TTable> {
  private _session: Session;
  private _logger: BaseLogger;

  public constructor(db: DB | Stub) {
    if (db instanceof DB) {
      this._session = db.session();
      this._logger = db.logger();
    } else {
      // eslint-disable-next-line no-console
      console.log(`\n--------\nWARNING: If you are not using static instance of ${this.constructor.name} class, make sure you have provided db in constructor\n--------\n`);
    }
  }

  // @TODO document, that you should not use arrow functions for abstract classes
  public abstract tableName(): string;

  public withLogger = (logger: BaseLogger) => {
    this._logger = logger;
  };

  public select = (): SelectTRB<TTable> => {
    if (!this._session) {
      throw new Error(`Db was not provided in constructor, while ${this.constructor.name} class was creating. Please make sure, that you provided Db object to ${this.constructor.name} class. Should be -> new ${this.constructor.name}(db)`);
    }

    return new SelectTRB(this.tableName(),
      this._session, this.mapServiceToDb(), this._logger);
  };

  public update = (): UpdateTRB<TTable> => {
    if (!this._session) {
      throw new Error(`Db was not provided in constructor, while ${this.constructor.name} class was creating. Please make sure, that you provided Db object to ${this.constructor.name} class. Should be -> new ${this.constructor.name}(db)`);
    }
    return new UpdateTRB(this.tableName(), this._session, this.mapServiceToDb(), this._logger);
  };

  public insert = (value: ExtractModel<TTable>):
  InsertTRB<TTable> => {
    if (!this._session) {
      throw new Error(`Db was not provided in constructor, while ${this.constructor.name} class was creating. Please make sure, that you provided Db object to ${this.constructor.name} class. Should be -> new ${this.constructor.name}(db)`);
    }
    return new InsertTRB([value], this.tableName(), this._session,
      this.mapServiceToDb(), this._logger);
  };

  public insertMany = (values: ExtractModel<TTable>[]):
  InsertTRB<TTable> => {
    if (!this._session) {
      throw new Error(`Db was not provided in constructor, while ${this.constructor.name} class was creating. Please make sure, that you provided Db object to ${this.constructor.name} class. Should be -> new ${this.constructor.name}(db)`);
    }
    return new InsertTRB(values, this.tableName(), this._session,
      this.mapServiceToDb(), this._logger);
  };

  public delete = (): DeleteTRB<TTable> => {
    if (!this._session) {
      throw new Error(`Db was not provided in constructor, while ${this.constructor.name} class was creating. Please make sure, that you provided Db object to ${this.constructor.name} class. Should be -> new ${this.constructor.name}(db)`);
    }
    return new DeleteTRB(this.tableName(), this._session,
      this.mapServiceToDb(), this._logger);
  };

  public varchar(name: string, params?: {size?: number, notNull: false}): Column<PgVarChar, true>;
  public varchar(name: string, params: {size?: number, notNull: true}): Column<PgVarChar, false>;
  public varchar(name: string, params?: {size?: number, notNull?: false}): Column<PgVarChar, true>;
  public varchar(name: string, params: {size?: number, notNull?: true}): Column<PgVarChar, false>;
  public varchar(name: string, params: {size?: number, notNull?: boolean} = {}) {
    return new Column(this.tableName(), name, new PgVarChar(params.size), params?.notNull ?? false);
  }

  public int(name: string, params?: {notNull: false}): Column<PgInteger, true>;
  public int(name: string, params: {notNull: true}): Column<PgInteger, false>;
  public int(name: string, params: {notNull?: boolean} = {}) {
    return new Column(this.tableName(), name, new PgInteger(), params?.notNull ?? false);
  }

  public timestamp(name: string, params?: {notNull: false}): Column<PgTimestamp, true>;
  public timestamp(name: string, params: {notNull: true}): Column<PgTimestamp, false>;
  public timestamp(name: string, params: {notNull?: boolean} = {}) {
    return new Column(this.tableName(), name, new PgTimestamp(), params?.notNull ?? false);
  }

  public bigint(name: string, params?: {notNull: false}): Column<PgBigInt, true>;
  public bigint(name: string, params: {notNull: true}): Column<PgBigInt, false>;
  public bigint(name: string, params: {notNull?: boolean} = {}) {
    return new Column(this.tableName(), name, new PgBigInt(), params?.notNull ?? false);
  }

  public enum<TSubType extends { [s: number]: string }>(from: { [s: number]: string },
    name: string, dbName:string, params?: {notNull: false})
  : Column<PgEnum<TSubType>, true>;
  public enum<TSubType extends { [s: number]: string }>(from: { [s: number]: string },
    name: string, dbName:string, params: {notNull: true})
  : Column<PgEnum<TSubType>, false>;
  public enum<TSubType extends { [s: number]: string }>(from: { [s: number]: string },
    name: string, dbName:string, params: {notNull?: boolean} = {}) {
    return new Column(this.tableName(), name,
      new PgEnum<TSubType>(name, dbName, from as TSubType), params?.notNull ?? false);
  }

  public decimal(name: string, params?: {notNull: false, precision: number, scale: number})
  : Column<PgBigDecimal, true>;
  public decimal(name: string, params: {notNull: true, precision: number, scale: number})
  : Column<PgBigDecimal, false>;
  public decimal(name: string, params: {notNull?: boolean,
    precision?: number, scale?: number} = {}) {
    return new Column(this.tableName(), name,
      new PgBigDecimal(params.precision, params.scale), params?.notNull ?? false);
  }

  public time(name: string, params?: {notNull: false}): Column<PgTime, true>;
  public time(name: string, params: {notNull: true}): Column<PgTime, false>;
  public time(name: string, params: {notNull?: boolean} = {}) {
    return new Column(this.tableName(), name, new PgTime(), params?.notNull ?? false);
  }

  public bool(name: string, params?: {notNull: false}): Column<PgBoolean, true>;
  public bool(name: string, params: {notNull: true}): Column<PgBoolean, false>;
  public bool(name: string, params: {notNull?: boolean} = {}) {
    return new Column(this.tableName(), name, new PgBoolean(), params?.notNull ?? false);
  }

  public text(name: string, params?: {notNull: false}): Column<PgText, true>;
  public text(name: string, params: {notNull: true}): Column<PgText, false>;
  public text(name: string, params: {notNull?: boolean} = {}) {
    return new Column(this.tableName(), name, new PgText(), params?.notNull ?? false);
  }

  public jsonb<TSubType>(name: string, params?: {notNull: false})
  : Column<PgJsonb<TSubType>, true>;
  public jsonb<TSubType>(name: string, params: {notNull: true})
  : Column<PgJsonb<TSubType>, false>;
  public jsonb<TSubType>(name: string, params: {notNull?: boolean} = {}) {
    return new Column(this.tableName(), name,
      new PgJsonb<TSubType>(), params?.notNull ?? false);
  }

  public mapServiceToDb(): {[name in keyof ExtractModel<TTable>]: Column<ColumnType>} {
    return Object.getOwnPropertyNames(this)
      .reduce<{[name in keyof ExtractModel<TTable>]: Column<ColumnType>}>((res, fieldName) => {
      const field: unknown = (this as unknown as TTable)[fieldName as keyof TTable];
      if (field instanceof Column) {
        res[fieldName as keyof ExtractModel<TTable>] = field;
      }
      return res;
    }, {} as {[name in keyof ExtractModel<TTable>]: Column<ColumnType>});
  }
}
