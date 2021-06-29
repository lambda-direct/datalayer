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
import { Db } from '../db';

export default abstract class AbstractTable<SERVICE> {
  private _session: Session;
  private _logger: BaseLogger;

  public constructor(db?: Db) {
    if (db) {
      this._session = db.session();
      this._logger = db.logger();
    } else {
      // eslint-disable-next-line no-console
      console.log(`\n--------\nWARNING: If you are not using static instance of ${this.constructor.name} class, make sure you have provided db in constructor\n--------\n`);
    }
  }

  // @TODO document, that you should not use arrow functions for abstract classes
  public abstract tableName(): string;

  public abstract mapServiceToDb(): {[name in keyof SERVICE]: Column<ColumnType>};

  public withLogger = (logger: BaseLogger) => {
    this._logger = logger;
  };

  public select = (): SelectTRB<SERVICE> => {
    if (!this._session || !this._logger) {
      throw new Error(`Db was not provided in constructor, while ${this.constructor.name} class was creating. Please make sure, that you provided Db object to ${this.constructor.name} class. Should be -> new ${this.constructor.name}(db)`);
    }

    return new SelectTRB(this.tableName(),
      this._session, this.mapServiceToDb(), this.getColumns(), this._logger);
  };

  public update = (): UpdateTRB<SERVICE> => {
    if (!this._session || !this._logger) {
      throw new Error(`Db was not provided in constructor, while ${this.constructor.name} class was creating. Please make sure, that you provided Db object to ${this.constructor.name} class. Should be -> new ${this.constructor.name}(db)`);
    }
    const mappedServiceToDb = this.mapServiceToDb();
    return new UpdateTRB(this.tableName(), this._session, mappedServiceToDb,
      this.getColumns(), this._logger);
  };

  public insert = (values: Partial<SERVICE>[]):
  InsertTRB<SERVICE> => {
    if (!this._session || !this._logger) {
      throw new Error(`Db was not provided in constructor, while ${this.constructor.name} class was creating. Please make sure, that you provided Db object to ${this.constructor.name} class. Should be -> new ${this.constructor.name}(db)`);
    }
    return new InsertTRB(values, this.tableName(), this._session,
      this.mapServiceToDb(), this.getColumns(), this._logger);
  };

  public delete = (): DeleteTRB<SERVICE> => {
    if (!this._session || !this._logger) {
      throw new Error(`Db was not provided in constructor, while ${this.constructor.name} class was creating. Please make sure, that you provided Db object to ${this.constructor.name} class. Should be -> new ${this.constructor.name}(db)`);
    }
    return new DeleteTRB(this.tableName(), this._session,
      this.mapServiceToDb(), this.getColumns(), this._logger);
  };

  public varchar = ({ name, size }: {name: string, size: number}):
  Column<PgVarChar> => new Column<PgVarChar, {}>(this.tableName(), name, new PgVarChar(size));

  public timestamp = ({ name }: {name: string}):
  Column<PgTimestamp> => new Column<PgTimestamp, {}>(this.tableName(), name, new PgTimestamp());

  public int = ({ name }: {name: string}):
  Column<PgInteger> => new Column<PgInteger, {}>(this.tableName(), name, new PgInteger());

  public bigint = ({ name }: {name: string}):
  Column<PgBigInt> => new Column<PgBigInt, {}>(this.tableName(), name, new PgBigInt());

  public decimal = ({ name, precision, scale }:
  {name: string, precision: number, scale: number}):
  Column<PgBigDecimal> => new Column<PgBigDecimal, {}>(this.tableName(),
    name, new PgBigDecimal(precision, scale));

  public time = ({ name }: {name: string})
  : Column<PgTime> => new Column<PgTime, {}>(this.tableName(), name, new PgTime());

  public bool = ({ name }: {name: string}):
  Column<PgBoolean> => new Column<PgBoolean, {}>(this.tableName(), name, new PgBoolean());

  public text = ({ name }: {name: string}):
  Column<PgText> => new Column<PgText, {}>(this.tableName(), name, new PgText());

  public jsonb = <SUBTYPE>({ name }: {name: string}):
  Column<PgJsonb> => new Column<PgJsonb, SUBTYPE>(this.tableName(), name, new PgJsonb());

  private getColumns = (): Column<ColumnType, {}>[] => {
    const columns: Column<ColumnType, {}>[] = [];
    Object.values(this).forEach((field: any) => {
      if (field instanceof Column) {
        columns.push(field);
      }
    });
    return columns;
  };
}
