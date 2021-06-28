import { ClientConfig, Pool } from 'pg';
import Db from './db';
import DBStringConnector from './dbStringConnector';

export default class DbConnector {
  private _host: string;
  private _db: string;
  private _port: number;
  private _user: string;
  private _password: string;

  public connectionString = (url: string): DBStringConnector => new DBStringConnector(url);

  public host = (host: string): DbConnector => {
    this._host = host;
    return this;
  };

  public port = (port: number): DbConnector => {
    this._port = port;
    return this;
  };

  public db = (db: string): DbConnector => {
    this._db = db;
    return this;
  };

  public user = (user: string): DbConnector => {
    this._user = user;
    return this;
  };

  public password = (password: string): DbConnector => {
    this._password = password;
    return this;
  };

  public connect = async (): Promise<Db> => {
    const config = {
      user: this._user,
      host: this._host,
      database: this._db,
      password: this._password,
      port: this._port,
    } as ClientConfig;

    try {
      const pool = new Pool(config);

      await pool.connect();
      console.log('Db connected!');

      return new Db(pool);
    } catch (e) {
      console.log(`Connection error: ${e.message}`);
      throw new Error(`Connection error: ${e.message}`);
    }
  };
}
