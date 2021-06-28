import { Pool } from 'pg';
import AbstractTable from '../tables/abstractTable';
import Session from './session';

export default class Db {
  private _session: Session;

  public constructor(pool: Pool) {
    this._session = new Session(pool);
  }

  public use = <T extends AbstractTable<{}>>(table: T): void => {
    table.withConnection(this._session);
  };

  public session = (): Session => this._session;
}
