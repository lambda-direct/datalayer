import Create from '../builders/lowLvlBuilders/create';
import Transaction from '../builders/transaction/transaction';
import Db from '../db/db';
import { MigrationsModel, MigrationsTable } from '../tables/migrationsTable';
import SessionWrapper from './sessionWrapper';

export default class Migrator {
  private _db: Db;
  private migrationsPerVersion: Map<number,
  (sessionWrapper: SessionWrapper) => Promise<void>> = new Map();

  private sessionWrapper: SessionWrapper;

  public constructor(db: Db) {
    this._db = db;
    this.sessionWrapper = new SessionWrapper(this._db);
  }

  public chain = (version: number,
    migration: (sessionWrapper: SessionWrapper) => Promise<void>): Migrator => {
    this.migrationsPerVersion.set(version, async (sessionWrapper) => {
      await migration(sessionWrapper);
    });
    return this;
  };

  public execute = async (): Promise<boolean> => {
    const migrationsTable = new MigrationsTable();
    this._db.use(migrationsTable);

    await this.sessionWrapper.execute(Create.table(migrationsTable).build());

    const migrations: Array<MigrationsModel> = await migrationsTable.select().all();
    const latestMigration: MigrationsModel | null = this.getLastOrNull(migrations);
    let queriesToExecute: Map<number,
    (sessionWrapper: SessionWrapper) => Promise<void>> = this.migrationsPerVersion;

    if (latestMigration != null) {
      const queriesToExecuteTest: Map<number,
      (sessionWrapper: SessionWrapper) => Promise<void>> = new Map();

      // eslint-disable-next-line no-restricted-syntax
      for (const [key, value] of this.migrationsPerVersion) {
        if (key > latestMigration.version) {
          queriesToExecuteTest.set(key, value);
        }
      }

      queriesToExecute = queriesToExecuteTest;
    }

    const transaction = new Transaction(this.sessionWrapper);
    await transaction.begin();
    // eslint-disable-next-line no-restricted-syntax
    for await (const key of queriesToExecute.keys()) {
      try {
        const value = queriesToExecute.get(+key)!;
        await value(this.sessionWrapper);
        await migrationsTable
          .insert([{ version: +key, createdAt: new Date() }]).returningAll();
      } catch (e) {
        await transaction.rollback();
        throw new Error(`Migration chain ${key} was not migrated sucessfully.\nMessage: ${e.message}`);
      }
    }

    await transaction.commit();

    return true;
  };

  public getLastOrNull = (list: Array<MigrationsModel>): MigrationsModel | null => {
    let latestMigration: MigrationsModel | null = null;
    if (list.length !== 0) {
      latestMigration = list[list.length - 1];
    }
    return latestMigration;
  };

  private forLoop = async (migrationsTable: MigrationsTable,
    queriesToExecute: Map<number, () => Promise<void>>) => {
    queriesToExecute.forEach(async (value, i) => {
      const transaction = new Transaction(this.sessionWrapper);
      transaction.begin();
      try {
        // eslint-disable-next-line no-await-in-loop
        await value();
        // eslint-disable-next-line no-await-in-loop
        await migrationsTable.insert([{ version: i, createdAt: new Date() }]).returningAll();
      } catch (e) {
        transaction.rollback();
        throw new Error(`Migration chain ${i} was not migrated sucessfully.\nError: ${e.message}`);
      }
      transaction.commit();
    });
    // for (let i = 0; i < queriesToExecute.size; i += 1) {
    //   const value = queriesToExecute.get(i)!;
    //   const transaction = new Transaction(this._db._pool);
    //   transaction.begin();
    //   try {
    //     // eslint-disable-next-line no-await-in-loop
    //     await value();
    //     // eslint-disable-next-line no-await-in-loop
    //     await migrationsTable.insert([{ version: i, createdAt: new Date() }]).returningAll();
    //   } catch (e) {
    //     transaction.rollback();
    //     throw new Error(`Migration chain ${i}
    // was not migrated sucessfully.\nError: ${e.message}`);
    //   }
    //   transaction.commit();
    // }
  };
}
