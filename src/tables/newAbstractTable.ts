/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable max-classes-per-file */
// eslint-disable-next-line import/no-cycle
import NewInsertTRB from '../builders/highLvlBuilders/newInsert';
import ColumnType from '../columns/types/columnType';
import Column from '../columns/column';
import { Db } from '../db';
import Session from '../db/session';
import BaseLogger from '../logger/abstractLogger';
import { AbstractTable } from '.';
import PgVarChar from '../columns/types/pgVarChar';
import PgTimestamp from '../columns/types/pgTimestamp';
import PgInteger from '../columns/types/pgInteger';
import { PgBigInt } from '../columns';

type Stub = {};

type NExtractFieldNames<T> = {
  [Key in keyof T]: T[Key] extends Function ? never : Key;
}[keyof T];

export type NExtractModel<TTable> = {
  [Key in NExtractFieldNames<TTable>]: NExtractCodeType<TTable[Key]>
};

type NExtractCodeType<T extends Column<ColumnType<any>>> =
    T extends Column<ColumnType<infer TCodeType>> ?
      TCodeType
      : never;

export default abstract class NAbstractTable<TTable extends NAbstractTable<any>> {
  private _session: Session;
  private _logger: BaseLogger;

  public constructor(db: Db | Stub) {
    if (db instanceof Db) {
      this._session = db.session();
      this._logger = db.logger();
    } else {
      // eslint-disable-next-line no-console
      console.log(`\n--------\nWARNING: If you are not using static instance of ${this.constructor.name} class, make sure you have provided db in constructor\n--------\n`);
    }
  }

  // @TODO document, that you should not use arrow functions for abstract classes
  public abstract tableName(): string;

  public varchar = ({ name, size }: {name: string, size: number}):
  Column<PgVarChar> => new Column<PgVarChar, {}>(this.tableName(), name, new PgVarChar(size));

  public timestamp = ({ name }: {name: string}):
  Column<PgTimestamp> => new Column<PgTimestamp, {}>(this.tableName(), name, new PgTimestamp());

  public int = ({ name }: {name: string}):
  Column<PgBigInt> => new Column<PgBigInt, {}>(this.tableName(), name, new PgBigInt());

  private mapServiceToDb(value: NExtractModel<TTable>): {[name in keyof NExtractModel<TTable>]: Column<ColumnType>} {
    return Object.getOwnPropertyNames(this).reduce<{[name in keyof NExtractModel<TTable>]: Column<ColumnType>}>((res, fieldName) => {
      const field = fieldName as keyof NExtractModel<TTable>;
      if (field instanceof Column) {
        res[field] = field;
      }
      return res;
    }, {} as {[name in keyof NExtractModel<TTable>]: Column<ColumnType>});
  }

  public insert = (value: NExtractModel<TTable>):
  NewInsertTRB<NExtractModel<TTable>> | undefined => {
    if (!this._session) {
      throw new Error(`Db was not provided in constructor, while ${this.constructor.name} class was creating. Please make sure, that you provided Db object to ${this.constructor.name} class. Should be -> new ${this.constructor.name}(db)`);
    }
    return new NewInsertTRB([value], this.tableName(), this._session,
      this.mapServiceToDb(value), Object.values(this.mapServiceToDb(value)), this._logger);
  }
  ;
}

class NewTest extends NAbstractTable<NewTest> {
  id = this.int({ name: 'id' });
  userName = this.varchar({ name: 'user_name', size: 256 }).isNullable();

  public tableName(): string {
    return 'tests';
  }
}

const newTest = new NewTest({});
type User = NExtractModel<NewTest>;
// type r = NExtractCodeType1<NewTest['id']>;
// type t = NExtractCodeType<PgBigInt>;
// type t1 = NExtractCodeType<PgVarChar>;

newTest.insert({
  id: 1,
  userName: 'df',
});
