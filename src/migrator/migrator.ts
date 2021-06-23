import Create from '../builders/lowLvlBuilders/create';
import Db from '../db/db';
import MigrationsTable, { MigrationsModel } from '../tables/migrationsTable';
import SessionWrapper from './sessionWrapper';

export default class Migrator {
  private _db: Db;
  private migrationsPerVersion: {[key: number]: () => Promise<boolean>} = {};

  public constructor(db: Db) {
    this._db = db;
  }

  public chain = <M>(version: number,
    migration: (sessionWrapper: SessionWrapper) => M): Migrator => {
    this.migrationsPerVersion[version] = async () => {
      migration(new SessionWrapper(this._db));
      return true;
    };
    return this;
  };

  public execute = async () => {
    const migrationsTable = new MigrationsTable();
    this._db.use(migrationsTable);

    await this._db._pool.query(Create.table(migrationsTable).build());

    const migrations: Array<MigrationsModel> = await migrationsTable.select().all();
    const latestMigration: MigrationsModel | null = this.getLastOrNull(migrations);
    let queriesToExecute: {[key: number]: () => Promise<boolean>} = this.migrationsPerVersion;

    if (latestMigration != null) {
      const queriesToExecuteTest: {[key: number]: () => Promise<boolean>} = {};

      Object.entries(this.migrationsPerVersion).forEach(([key, value]) => {
        if (+key > latestMigration.version) {
          queriesToExecuteTest[+key] = value;
        }
      });

      queriesToExecute = queriesToExecuteTest;
    }

    // eslint-disable-next-line no-restricted-syntax
    for await (const [key, value] of new Map(Object.entries(queriesToExecute))) {
      await value();
      migrationsTable.insert([{ version: +key, createdAt: new Date() }]).returningAll();
    }
  };

  public getLastOrNull = (list: Array<MigrationsModel>): MigrationsModel | null => {
    let latestMigration: MigrationsModel | null = null;
    if (list.length !== 0) {
      latestMigration = list[list.length - 1];
    }
    return latestMigration;
  };
}
