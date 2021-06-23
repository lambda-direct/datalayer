import Column from '../columns/column';
import ColumnType from '../columns/types/columnType';
import AbstractTable from '../tables/abstractTable';

export class UsersTable extends AbstractTable<UsersModel> {
  public readonly id = this.int({ name: 'id' }).autoIncrement().primaryKey();
  public readonly name = this.varchar({ name: 'name', size: 256 });
  public readonly city = this.varchar({ name: 'city', size: 256 });
  public readonly country = this.varchar({ name: 'country', size: 256 });

  public mapServiceToDb(): { [name in keyof UsersModel]: Column<ColumnType, {}> } {
    return {
      id: this.id,
      name: this.name,
      city: this.city,
      country: this.country,
    };
  }

  public tableName(): string {
    return 'users';
  }
}

export interface UsersModel {
  id: number;
  name: string;
  city: string;
  country: string;
}
