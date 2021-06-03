import { Pool } from "pg";
import { Column } from "../columns/column";
import { PgVarChar } from "../columns/types/pgVarChar";
import { DeleteTRB, InsertTRB, SelectTRB, UpdateTRB } from "../builders/requestBuilders";
import { PgInteger } from "../columns/types/pgInteger";

export abstract class AbstractTable<K = any> {
    private _pool: Pool;

    protected varchar({name, size}: {name: string, size: number}): Column<PgVarChar> {
        return Column.varchar(this, name, size);
    }

    protected int({name}: {name: string}): Column<PgInteger> {
        return Column.int(this, name);
    }

    withConnection(connection: Pool) {
        this._pool = connection;
    }

    select(): SelectTRB<K> {
        return new SelectTRB(this, this._pool);
    }

    update(): UpdateTRB<K> {
        return new UpdateTRB(this, this._pool);
    }

    insert(values: K[]): InsertTRB<K> {
        return new InsertTRB(values, this, this._pool);
    }

    delete(): DeleteTRB<K> {
        return new DeleteTRB(this, this._pool);
    }

    abstract tableName(): string;

    abstract map(response: RowMapper): K; 
}

export class RowMapper {
    private row: any

    constructor(row: any){
        this.row = row;
    }

    getVarchar(column: Column<PgVarChar>): string{
        return this.row[column.getAlias()];
    }
}