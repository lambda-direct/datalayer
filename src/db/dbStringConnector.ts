import { ClientConfig, Pool } from 'pg';
import { DB } from '.';

export default class DBStringConnector {
  private _url: string;

  public constructor(url: string) {
    this._url = url;
  }

  public connect = async (): Promise<DB> => {
    const config = {
      connectionString: this._url,
    } as ClientConfig;

    try {
      const pool = new Pool(config);

      await pool.connect();
      console.log('Db connected!');

      return new DB(pool);
    } catch (e) {
      console.log(`Connection error: ${e.message}`);
      throw new Error(`Connection error: ${e.message}`);
    }
  };

  public connectSync = (): DB => {
    const config = {
      connectionString: this._url,
    } as ClientConfig;

    try {
      const pool = new Pool(config);

      // await pool.connect();
      // console.log('Db connected!');

      // check if table structure is the same as in code

      return new DB(pool);
    } catch (e) {
      console.log(`Connection error: ${e.message}`);
      throw new Error(`Connection error: ${e.message}`);
    }
  };
}
