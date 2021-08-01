/* eslint-disable import/export */
/* eslint-disable max-classes-per-file */
import Create from '../builders/lowLvlBuilders/create';
import Transaction from '../builders/transaction/transaction';
import Db from '../db/db';
import Session from '../db/session';
import {
  ExtractModel,
} from '../tables/inferTypes';
import MigrationsTable from '../tables/migrationsTable';

export class MigrationSession {
  private finalQuery = '';

  public execute = (query: string): void => {
    this.finalQuery += query;
    this.finalQuery += '\n';
  };

  public getQuery = (): string => this.finalQuery;
}

type MigrationType = string | ((session: Session) => Promise<void>);

export default class Migrator {
  private _db: Db;
  private migrationsPerVersion: Map<number, MigrationType> = new Map();
  private session: Session;

  public constructor(db: Db) {
    this._db = db;
    this.session = db.session();
  }

  public chain = (version: number,
    migration: (dbSession: MigrationSession) => void): Migrator => {
    const migrationSession = new MigrationSession();
    migration(migrationSession);
    this.migrationsPerVersion.set(version, migrationSession.getQuery());
    return this;
  };

  public scriptChain = (version: number,
    migration: (dbSession: Session) => Promise<void>): Migrator => {
    this.migrationsPerVersion.set(version, migration);
    return this;
  };

  public getResultScript = (): string[] => {
    const values: string[] = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const value of this.migrationsPerVersion.values()) {
      if (typeof value === 'string') {
        values.push();
      }
    }
    return values;
  };

  public execute = async (): Promise<boolean> => {
    const migrationsTable = new MigrationsTable(this._db);

    await this.session.execute(Create.table(migrationsTable).build());

    const migrations: Array<ExtractModel<MigrationsTable>> = await migrationsTable.select().all();
    const latestMigration: ExtractModel<MigrationsTable> | null = this.getLastOrNull(migrations);
    let queriesToExecute: Map<number, MigrationType> = this.migrationsPerVersion;

    if (latestMigration != null) {
      const queriesToExecuteTest: Map<number, MigrationType> = new Map();

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
        if (typeof value === 'string') {
          const result = await this._db.session().execute(value);
          if (result.isLeft()) {
            const { reason } = result.value;
            throw new Error(`Error while executing migration version ${key}. Error: ${reason}`);
          } else {
            await migrationsTable
              .insert({ version: +key, createdAt: new Date() }).all();
          }
        } else {
          await value(this.session);
          await migrationsTable
            .insert({ version: +key, createdAt: new Date() }).all();
        }
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
