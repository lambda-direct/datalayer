import AbstractTable from '../tables/abstractTable';
// import TestEnum from './testEnum';
import UsersTable from './usersTable';

export default class CitiesTable extends AbstractTable<CitiesTable> {
  public name = this.timestamp('name', { notNull: true }).defaultValue(new Date());
  public page = this.varchar('page', { size: 256 });
  public userId = this.int('user_id').references(UsersTable.INSTANCE.id);
  public data = this.jsonb<string[]>('data');
  // public enum1 = this.enum<TestEnum>(TestEnum, 'enum_test', 'dbEnum', { notNull: true });

  public tableName(): string {
    return 'citiess';
  }
}
