/* eslint-disable max-classes-per-file */
import { Pool } from 'pg';
import BaseLogger from '../logger/abstractLogger';
import Session from './session';

export interface IDB {

}

export class StubDB implements IDB {

}

export default class DB implements IDB {
  private _session: Session;
  private _logger?: BaseLogger;

  public constructor(pool: Pool) {
    this._session = new Session(pool);
  }

  public useLogger = (logger: BaseLogger): void => {
    this._logger = logger;
  };

  public logger = (): BaseLogger | undefined => this._logger;

  public session = (): Session => this._session;
}
