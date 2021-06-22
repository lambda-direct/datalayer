import Db from '../db/db';

export default class SessionWrapper {
  private _db: Db;

  public constructor(db: Db) {
    this._db = db;
  }

  public execute = async (query: string): Promise<void> => {
    await this._db._pool.query(query);
  };

  public update = async (query: string): Promise<void> => {
    await this._db._pool.query(query);
  };
}
