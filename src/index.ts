import { ClientConfig } from 'pg';
import Create from './builders/lowLvlBuilders/create';
import { DB, DbConnector } from './db';
import Migrator from './migrator/migrator';
import AbstractTable from './tables/abstractTable';

export * from './db';
export * from './builders';
export * from './columns';
export * from './tables';

export const anotherMinor = {
  async connect(config: ClientConfig): Promise<DB> {
    const dbConnector: DbConnector = new DbConnector().params(config);
    return dbConnector.connect();
  },
  builders: {
    createTable<TTable extends AbstractTable<TTable>>(table: AbstractTable<TTable>)
      : Create<TTable> {
      return Create.table(table);
    },
  },
  migrator(db:DB): Migrator {
    return new Migrator(db);
  },
};

export const minor = {
  prepareCreateTable<TTable extends AbstractTable<TTable>>(table: AbstractTable<TTable>): string {
    return Create.table(table).build();
  },
  migrator(db:DB): Migrator {
    return new Migrator(db);
  },
  async connect(config: ClientConfig): Promise<DB> {
    const dbConnector: DbConnector = new DbConnector().params(config);
    return dbConnector.connect();
  },
};

// export default minor;
