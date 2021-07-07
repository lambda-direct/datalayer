import Create from '../builders/lowLvlBuilders/create';
import Transaction from '../builders/transaction/transaction';
import Db from '../db/db';
import Session from '../db/session';
import { MigrationsTable } from '../tables';
import {
  ExtractModel,
} from '../tables/inferTypes';

export default class Migrator {
  private _db: Db;
  private migrationsPerVersion: Map<number,
  (session: Session) => Promise<void>> = new Map();

  private session: Session;

  public constructor(db: Db) {
    this._db = db;
    this.session = db.session();
  }

  public chain = (version: number,
    migration: (session: Session) => Promise<void>): Migrator => {
    this.migrationsPerVersion.set(version, async (session) => {
      await migration(session);
    });
    return this;
  };

  public execute = async (): Promise<boolean> => {
    const migrationsTable = new MigrationsTable(this._db);

    console.log('here');
    await this.session.execute(Create.table(migrationsTable).build());
    console.log(Create.table(migrationsTable).build());

    const migrations: Array<ExtractModel<MigrationsTable>> = await migrationsTable.select().all();
    const latestMigration: ExtractModel<MigrationsTable> | null = this.getLastOrNull(migrations);
    let queriesToExecute: Map<number,
    (session: Session) => Promise<void>> = this.migrationsPerVersion;

    if (latestMigration != null) {
      const queriesToExecuteTest: Map<number,
      (session: Session) => Promise<void>> = new Map();

      // eslint-disable-next-line no-restricted-syntax
      for (const [key, value] of this.migrationsPerVersion) {
        if (key > latestMigration.version) {
          queriesToExecuteTest.set(key, value);
        }
      }

      queriesToExecute = queriesToExecuteTest;
    }

    const transaction = new Transaction(this.session);
    await transaction.begin();
    // eslint-disable-next-line no-restricted-syntax
    for await (const key of queriesToExecute.keys()) {
      try {
        const value = queriesToExecute.get(+key)!;
        await value(this.session);
        await migrationsTable
          .insert({ version: +key, createdAt: new Date() }).all();
      } catch (e) {
        await transaction.rollback();
        throw new Error(`Migration chain ${key} was not migrated sucessfully.\nMessage: ${e.message}`);
      }
    }

    await transaction.commit();

    return true;
  };

  public getLastOrNull = (list: Array<ExtractModel<MigrationsTable>>)
  : ExtractModel<MigrationsTable> | null => {
    let latestMigration: ExtractModel<MigrationsTable> | null = null;
    if (list.length !== 0) {
      latestMigration = list[list.length - 1];
    }
    return latestMigration;
  };
}
