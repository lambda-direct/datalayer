import { Pool } from "pg";
import { Column } from "../columns/column";
import { PgVarChar } from "../columns/types/pgVarChar";
import { PgTimestamp } from "../columns/types/pgTimestamp";
import { PgInteger } from "../columns/types/pgInteger";
import { PgBigDecimal } from "../columns/types/pgBigDecimal";
import { PgTime } from "../columns/types/pgTime";
import { PgBoolean } from "../columns/types/pgBoolean";
import { PgText } from "../columns/types/pgText";
import { DeleteTRB, InsertTRB, SelectTRB, UpdateTRB } from "../builders/highLvlBuilders";
import { PgJsonb } from "../columns/types/pgJsonb";
import { ColumnType } from "../columns/types/columnType";


export abstract class AbstractTable<SERVICE> {
    private _pool: Pool;

    protected varchar({name, size}: {name: string, size: number}): Column<PgVarChar> {
        return Column.varchar(this, name, size);
    }

    protected timestamp({name}: {name: string}): Column<PgTimestamp> {
        return Column.timestamp(this, name);
    }

    protected int({name}: {name: string}): Column<PgInteger> {
        return Column.int(this, name);
    }

    protected decimal({name, precision, scale}: {name: string, precision: number, scale: number}): Column<PgBigDecimal> {
        return Column.decimal(this, name, precision, scale);
    }

    protected time({name}: {name: string}): Column<PgTime> {
        return Column.time(this, name);
    }

    protected bool({name}: {name: string}): Column<PgBoolean> {
        return Column.bool(this, name);
    }

    protected text({name}: {name: string}): Column<PgText> {
        return Column.text(this, name);
    }

    protected jsonb<SUBTYPE>({name}: {name: string}): Column<PgJsonb> {
        return Column.jsonb<SUBTYPE>(this, name);
    }


    withConnection(connection: Pool) {
        this._pool = connection;
    }

    select(): SelectTRB<SERVICE> {
        return new SelectTRB(this, this._pool);
    }

    update(): UpdateTRB<SERVICE> {
        return new UpdateTRB(this, this._pool);
    }

    insert(values: SERVICE[]): InsertTRB<SERVICE> {
        return new InsertTRB(values, this, this._pool);
    }

    delete(): DeleteTRB<SERVICE> {
        return new DeleteTRB(this, this._pool);
    }

    abstract tableName(): string;
    
    abstract mapServiceToDb(): {[name in keyof SERVICE]: Column<ColumnType>};
}

export class RowMapper {
    private row: any

    constructor(row: any) {
        this.row = row;
    }

    getVarchar(column: Column<PgVarChar>): string {
        return this.row[column.getAlias()];
    }

    getInt(column: Column<PgInteger>): number {
        return this.row[column.getAlias()];
    }

    getTimestamp(column: Column<PgTimestamp>): Date {
        return this.row[column.getAlias()];
    }

    getJsonb<TYPE>(column: Column<PgJsonb, TYPE>): TYPE {
        return this.row[column.getAlias()] as TYPE;
    }

    getDecimal(column: Column<PgBigDecimal>): number {
        return this.row[column.getAlias()];
    }

    getTime(column: Column<PgTime>): Date {
        return this.row[column.getAlias()];
    }

    getBool(column: Column<PgBoolean>): boolean {
        return this.row[column.getAlias()];
    }

    getText(column: Column<PgText>): string {
        return this.row[column.getAlias()];
    }
}