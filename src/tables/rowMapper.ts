import Column from '../columns/column';
import PgBigDecimal from '../columns/types/pgBigDecimal';
import PgBoolean from '../columns/types/pgBoolean';
import PgInteger from '../columns/types/pgInteger';
import PgJsonb from '../columns/types/pgJsonb';
import PgText from '../columns/types/pgText';
import PgTime from '../columns/types/pgTime';
import PgTimestamp from '../columns/types/pgTimestamp';
import PgVarChar from '../columns/types/pgVarChar';

export default class RowMapper {
  private row: any;

  public constructor(row: any) {
    this.row = row;
  }

  public getVarchar = (column: Column<PgVarChar>): string => this.row[column.getAlias()];

  public getInt = (column: Column<PgInteger>): number => this.row[column.getAlias()];

  public getTimestamp = (column: Column<PgTimestamp>): Date => this.row[column.getAlias()];

  public getJsonb = <TYPE>(column: Column<PgJsonb>):
  TYPE => this.row[column.getAlias()] as TYPE;

  public getDecimal = (column: Column<PgBigDecimal>): number => this.row[column.getAlias()];

  public getTime = (column: Column<PgTime>): Date => this.row[column.getAlias()];

  public getBool = (column: Column<PgBoolean>): boolean => this.row[column.getAlias()];

  public getText = (column: Column<PgText>): string => this.row[column.getAlias()];
}
