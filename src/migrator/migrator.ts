import { Db } from "../db";
import { Create } from "../builders/lowLvlBuilders";
import { MigrationsModel, MigrationsTable } from "../tables/migrationsTable";

export class Migrator {
    private _db: Db;
    private migrationsPerVersion: Map<number, () => Promise<boolean>> = new Map<number, () => Promise<boolean>>();
  
    constructor(db: Db){
        this._db = db;
    }

    chain<M>(version: number, migration: (sessionWrapper: SessionWrapper) => M): Migrator {
        this.migrationsPerVersion.set(version, async () => {
            migration(new SessionWrapper(this._db));
            return true;
        });
        return this;
    }

    async execute() {
        const migrationsTable = new MigrationsTable();
        this._db.use(migrationsTable);

        await this._db._pool.query(Create.table(migrationsTable).build());

        const migrations: Array<MigrationsModel> = await migrationsTable.select().all();
        const latestMigration: MigrationsModel | null = this.getLastOrNull(migrations);
        let queriesToExecute: Map<number, () => Promise<boolean>> = this.migrationsPerVersion;
  
        if (latestMigration != null) {
            let queriesToExecuteTest: Map<number, () => Promise<boolean>> = new Map<number, () => Promise<boolean>>();

            for (let [key, value] of this.migrationsPerVersion) {
                if (key > latestMigration.version) {
                    queriesToExecuteTest.set(key, value);
                }
            }
            queriesToExecute = queriesToExecuteTest;
        }

        for (let [key, value] of queriesToExecute) {
           await value();
           migrationsTable.insert([{version: key, createdAt: new Date()}]).returningAll();
        }
    }

    getLastOrNull(list: Array<MigrationsModel>): MigrationsModel | null {
        let latestMigration: MigrationsModel | null = null;
        if (list.length != 0) {
            latestMigration = list[list.length - 1];
        }
        return latestMigration;
    }
}

export class SessionWrapper {
    private _db: Db;

    constructor(db: Db) {
        this._db = db;
    }

    async execute(query: string): Promise<void> {
        await this._db._pool.query(query);
    }

    async update(query: string): Promise<void> {
        await this._db._pool.query(query);
    }
}