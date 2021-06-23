import Column from '../columns/column';
import ColumnType from '../columns/types/columnType';
import AbstractTable from '../tables/abstractTable';

export class UsersTable extends AbstractTable<UserModel> {
  public static INSTANCE: UsersTable = new UsersTable();

  public id = this.int({ name: 'id' }).autoIncrement().primaryKey();
  public phone = this.varchar({ name: 'phone', size: 256 });
  public fullName = this.varchar({ name: 'full_name', size: 256 }).isNullable();
  public createdAt = this.timestamp({ name: 'created_at' });
  public updatedAt = this.timestamp({ name: 'updated_at' });

  public tableName(): string {
    return 'users';
  }

  public mapServiceToDb = ():{[name in keyof UserModel]: Column<ColumnType>} => ({
    id: this.id,
    phone: this.phone,
    fullName: this.fullName,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  });
}

export interface UserModel {
  id: number;
  phone: string;
  fullName: string | null;
  createdAt: Date;
  updatedAt: Date;
}
