import {
  ClientConfig, Pool, PoolClient,
} from 'pg';
import DB from './db';
import DBStringConnector from './dbStringConnector';

export default class DbConnector {
  private __config: ClientConfig;

  public connectionString = (url: string): DBStringConnector => new DBStringConnector(url);

  public params = (config: ClientConfig): DbConnector => {
    this.__config = config;
    return this;
  };

  public connect = async (connections?: number): Promise<DB> => {
    try {
      const pool = new Pool(this.__config);

      if (connections) {
        const promises: Promise<PoolClient>[] = [];
        for (let i = 0; i < connections; i += 1) {
          promises.push(pool.connect());
        }
        Promise.all(promises);
      }

      await pool.connect();
      console.log('Db connected!');

      // check if table structure is the same as in code

      return new DB(pool);
    } catch (e) {
      console.log(`Connection error: ${e.message}`);
      throw new Error(`Connection error: ${e.message}`);
    }
  };

  public connectSync = (): DB => {
    try {
      const pool = new Pool(this.__config);

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
