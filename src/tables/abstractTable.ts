import { Select } from "../builders/select/select";
import { Pool } from "pg";
import { Column } from "../columns/column";
import { PgVarChar } from "../columns/types/pgVarChar";
import { Expr, Where } from "../builders/where";

export abstract class AbstractTable<K = any> {
    private _pool: Pool;

    // TODO maybe we should have a params as objects, to have named params. Should be more readable in child classes
    protected varchar(name: string, size: number): Column<PgVarChar> {
        return Column.varchar(this, name, size);
    }

    // Should provide Pool or specific class for it?
    withConnection(connection: Pool) {
        this._pool = connection;
    }

    // ToDo better params handling
    // 1. As object with optional values?
    // 2. As params?
    // 3. In best case -> table.select(Array<Column>).where(Where.class).join(JoinProperties).orderBy(Column).
    //         each builder method will return IteratorWrapper, that you could iterate through or execute new builder method
    //    OR
    // 4. table.select({where:""})
    async select(filters?: Expr): Promise<Array<K>> {
        const queryBuilder = Select.from(this);
        if (filters){
            queryBuilder.filteredBy(filters);
        }

        const query = queryBuilder.build();
        console.log(query);

        const result = await this._pool!.query(query);

        const response: Array<K> = []
        for (const row of result.rows) {
            const mappedRow = this.map(new RowMapper(row));
            response.push(mappedRow);
        }

        return response;
    }

    abstract tableName(): string;

    protected abstract map(response: RowMapper): K; 
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