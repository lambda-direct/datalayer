import Column from '../columns/column';
import ColumnType from '../columns/types/columnType';
import AbstractTable from '../tables/abstractTable';
import { UsersTable } from './usersTable';

export class AuthOtpTable extends AbstractTable<AuthOtpModel> {
  public static INSTANCE: AuthOtpTable = new AuthOtpTable();

  public id = this.int({ name: 'id' }).autoIncrement().primaryKey();
  public phone = this.varchar({ name: 'phone', size: 256 });
  public otp = this.varchar({ name: 'otp', size: 256 });
  public issuedAt = this.timestamp({ name: 'issued_at' });
  public createdAt = this.timestamp({ name: 'created_at' });
  public updatedAt = this.timestamp({ name: 'updated_at' });
  public userId = this.int({ name: 'user_id' }).references(UsersTable.INSTANCE.id).isNullable();

  public tableName(): string {
    return 'auth_otp';
  }

  public mapServiceToDb = (): {[name in keyof AuthOtpModel]: Column<ColumnType>} => ({
    id: this.id,
    phone: this.phone,
    otp: this.otp,
    issuedAt: this.issuedAt,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    userId: this.userId,
  });
}

export interface AuthOtpModel {
  id?: number;
  phone: string;
  otp: string;
  issuedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  userId: number | null;
}
