export default class DbSelectError extends Error {
  public constructor(tableName: string, reason: Error, query: string) {
    super(`\nGot an error, while selecting from ${tableName}\nReason: ${reason.message}\nQuery to database looks like:\n\n${query}`);
    this.name = 'DbError';
    this.stack = reason.stack;

    Object.setPrototypeOf(this, DbSelectError.prototype);
  }
}
