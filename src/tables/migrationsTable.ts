import Column from '../columns/column';
import ColumnType from '../columns/types/columnType';
import AbstractTable from './abstractTable';

export default class MigrationsTable extends AbstractTable<MigrationsModel> {
  public id = this.int({ name: 'id' }).autoIncrement().primaryKey();
  public version = this.int({ name: 'version' }).unique();
  public created_at = this.timestamp({ name: 'created_at' });

  public mapServiceToDb = (): {[name in keyof MigrationsModel]: Column<ColumnType>} => ({
    id: this.id,
    version: this.version,
    createdAt: this.created_at,
  });

  public tableName(): string {
    return 'migrations';
  }
}

export interface MigrationsModel {
  id?: number,
  version: number;
  createdAt: Date;
}
