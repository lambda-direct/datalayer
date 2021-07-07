import AbstractTable from '../tables/abstractTable';

export default class UsersTable extends AbstractTable<UsersTable> {
  public static INSTANCE: UsersTable = new UsersTable({});

  public id = this.int('id').autoIncrement().primaryKey();
  public phone = this.varchar('phone', { size: 256, notNull: true });
  public fullName = this.varchar('full_name', { size: 256 });
  public createdAt = this.timestamp('created_at', { notNull: true });
  public updatedAt = this.timestamp('updated_at', { notNull: true });
  // public numberr = this.bigint('number_bigint', { notNull: true });

  public tableName(): string {
    return 'users';
  }
}
