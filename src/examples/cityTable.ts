import Column from '../columns/column';
import ColumnType from '../columns/types/columnType';
import AbstractTable from '../tables/abstractTable';

export class CitiesTable extends AbstractTable<CitiesModel> {
  public name = this.timestamp({ name: 'name' });
  public page = this.varchar({ name: 'page', size: 256 }).isNullable();
  public userId = this.int({ name: 'user_id' });
  public data = this.jsonb<string[]>({ name: 'data' });

  public mapServiceToDb = (): {[name in keyof CitiesModel]: Column<ColumnType>} => ({
    name: this.name,
    page: this.page,
    userId: this.userId,
    data: this.data,
  });

  public tableName = (): string => 'citiess';
}

export interface CitiesModel {
  name: Date;
  page: string | null;
  userId: number;
  data: string[]
}
