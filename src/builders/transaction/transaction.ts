import { SessionWrapper } from '../../migrator';

export default class Transaction {
  public constructor(private sessionWrapper: SessionWrapper) {
  }

  public begin = async (): Promise<Transaction> => {
    await this.sessionWrapper.execute('BEGIN;');
    return this;
  };

  public commit = async (): Promise<Transaction> => {
    await this.sessionWrapper.execute('COMMIT;');
    return this;
  };

  public rollback = async (): Promise<Transaction> => {
    await this.sessionWrapper.execute('ROLLBACK;');
    return this;
  };
}
