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
import SelectTRB from '../builders/highLvlBuilders/selectRequestBuilder';
import UpdateTRB from '../builders/highLvlBuilders/updateRequestBuilder';
import InsertTRB from '../builders/highLvlBuilders/insertRequestBuilder';
import DeleteTRB from '../builders/highLvlBuilders/deleteRequestBuilder';

export default abstract class AbstractTable<SERVICE> {
  private _pool: Pool;

  public select = (): SelectTRB<SERVICE> => new SelectTRB(this, this._pool);

  public varchar = ({ name, size }: {name: string, size: number}):
  Column<PgVarChar> => Column.varchar(this, name, size);

  public timestamp = ({ name }: {name: string}):
  Column<PgTimestamp> => Column.timestamp(this, name);

  public int = ({ name }: {name: string}): Column<PgInteger> => Column.int(this, name);

  public decimal = ({ name, precision, scale }:
  {name: string, precision: number, scale: number}):
  Column<PgBigDecimal> => Column.decimal(this, name, precision, scale);

  public time = ({ name }: {name: string}): Column<PgTime> => Column.time(this, name);

  public bool = ({ name }: {name: string}): Column<PgBoolean> => Column.bool(this, name);

  public text = ({ name }: {name: string}): Column<PgText> => Column.text(this, name);

  public jsonb = <SUBTYPE>({ name }: {name: string}):
  Column<PgJsonb> => Column.jsonb(this, name);

  public withConnection = (connection: Pool) => {
    this._pool = connection;
  };

  public update = (): UpdateTRB<SERVICE> => new UpdateTRB(this, this._pool);

  public insert = (values: SERVICE[]):
  InsertTRB<SERVICE> => new InsertTRB(values, this, this._pool);

  public delete = (): DeleteTRB<SERVICE> => new DeleteTRB(this, this._pool);

  public abstract tableName(): string;

  public abstract mapServiceToDb(): {[name in keyof SERVICE]: Column<ColumnType>};
}
