import { Pool } from 'pg';
import PgVarChar from '../columns/types/pgVarChar';
import PgTimestamp from '../columns/types/pgTimestamp';
import PgInteger from '../columns/types/pgInteger';
import PgBigDecimal from '../columns/types/pgBigDecimal';
import PgTime from '../columns/types/pgTime';
import PgBoolean from '../columns/types/pgBoolean';
import PgText from '../columns/types/pgText';
import PgJsonb from '../columns/types/pgJsonb';
import ColumnType from '../columns/types/columnType';
import Column from '../columns/column';

// Was commented as long as table was injected in constructor
// eslint-disable-next-line import/no-cycle
import SelectTRB from '../builders/highLvlBuilders/selectRequestBuilder';
// Was commented as long as table was injected in constructor
// eslint-disable-next-line import/no-cycle
import InsertTRB from '../builders/highLvlBuilders/insertRequestBuilder';
// Was commented as long as table was injected in constructor
// eslint-disable-next-line import/no-cycle
import DeleteTRB from '../builders/highLvlBuilders/deleteRequestBuilder';
import UpdateTRB from '../builders/highLvlBuilders/updateRequestBuilder';

export default abstract class AbstractTable<SERVICE> {
  private _pool: Pool;

  public select = (): SelectTRB<SERVICE> => new SelectTRB(this, this._pool);

  public varchar = ({ name, size }: {name: string, size: number}):
  Column<PgVarChar> => new Column<PgVarChar, {}>(this.tableName(), name, new PgVarChar(size));

  public timestamp = ({ name }: {name: string}):
  Column<PgTimestamp> => new Column<PgTimestamp, {}>(this.tableName(), name, new PgTimestamp());

  public int = ({ name }: {name: string}):
  Column<PgInteger> => new Column<PgInteger, {}>(this.tableName(), name, new PgInteger());

  public decimal = ({ name, precision, scale }:
  {name: string, precision: number, scale: number}):
  Column<PgBigDecimal> => new Column<PgBigDecimal, {}>(this.tableName(),
    name, new PgBigDecimal(precision, scale));

  public time = ({ name }: {name: string})
  : Column<PgTime> => new Column<PgTime, {}>(this.tableName(), name, new PgTime());

  public bool = ({ name }: {name: string}):
  Column<PgBoolean> => new Column<PgBoolean, {}>(this.tableName(), name, new PgBoolean());

  public text = ({ name }: {name: string}):
  Column<PgText> => new Column<PgText, {}>(this.tableName(), name, new PgText());

  public jsonb = <SUBTYPE>({ name }: {name: string}):
  Column<PgJsonb> => new Column<PgJsonb, SUBTYPE>(this.tableName(), name, new PgJsonb());

  public withConnection = (connection: Pool) => {
    this._pool = connection;
  };

  public update = (): UpdateTRB<SERVICE> => {
    const mappedServiceToDb = this.mapServiceToDb();
    return new UpdateTRB(this.tableName(), this._pool, mappedServiceToDb, this.getColumns());
  };

  public insert = (values: SERVICE[]):
  InsertTRB<SERVICE> => new InsertTRB(values, this, this._pool);

  public delete = (): DeleteTRB<SERVICE> => new DeleteTRB(this, this._pool);

  public abstract tableName(): string;

  public abstract mapServiceToDb(): {[name in keyof SERVICE]: Column<ColumnType>};

  private getColumns = (): Column<ColumnType, {}>[] => {
    const columns: Column<ColumnType, {}>[] = [];
    Object.values(this).forEach((field: any) => {
      if (field instanceof Column) {
        columns.push(field);
      }
    });
    return columns;
  };
}
