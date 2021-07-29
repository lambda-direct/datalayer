import { Pool } from 'pg';
import BaseLogger from '../logger/abstractLogger';
import Session from './session';

export default class DB {
  private _session: Session;
  private _logger: BaseLogger;

  public constructor(pool: Pool) {
    this._session = new Session(pool);
  }

  public useLogger = (logger: BaseLogger): void => {
    this._logger = logger;
  };

  public logger = (): BaseLogger => this._logger;

  public session = (): Session => this._session;
}
