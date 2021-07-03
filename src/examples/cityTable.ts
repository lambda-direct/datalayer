import Column from '../columns/column';
import ColumnType from '../columns/types/columnType';
import AbstractTable from '../tables/abstractTable';
import TestEnum from './testEnum';
import { UsersTable } from './usersTable';

export class CitiesTable extends AbstractTable<CityModel> {
  public name = this.timestamp({ name: 'name' }).defaultValue(new Date());
  public page = this.varchar({ name: 'page', size: 256 }).isNullable();
  public userId = this.int({ name: 'user_id' }).references(UsersTable.INSTANCE.id).isNullable();
  public data = this.jsonb<string[]>({ name: 'data' });
  public enum1 = this.enum(TestEnum, { columnName: 'enum_test', enumName: 'dbEnum' });

  public mapServiceToDb = (): {[name in keyof CityModel]: Column<ColumnType>} => ({
    name: this.name,
    page: this.page,
    userId: this.userId,
    data: this.data,
    enum1: this.enum1,
  });

  public tableName(): string {
    return 'citiess';
  }
}

export interface CityModel {
  name: Date;
  page: string | null;
  userId: number;
  data: string[];
  enum1: TestEnum;
}
