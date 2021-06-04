import { Column } from "../columns/column";
import { AbstractTable, RowMapper } from "../tables/abstractTable";

export class MigrationsTable extends AbstractTable<MigrationsModel> {
    id = this.int({name: "id"}).autoIncrement().primaryKey();
    version = this.int({name: "version"});
    created_at = this.timestamp({name: "created_at"});

    tableName(): string {
        return "migrations";
    }

    map(response: RowMapper): MigrationsModel {
        return {
            id: response.getInteger(this.id),
            version: response.getInteger(this.version),
            created_at: response.getTimestamp(this.created_at),
        };
    }

    getPrimaryKeys(): Column<any>[] {
        if (this.primaryKeys.length === 0) {
            this.primaryKeys.push(this.id);
        }
        return this.primaryKeys;
    }

    getUniqueKeys(): Column<any>[] {
        return this.uniqueKeys;
    }
}

export interface MigrationsModel {
    id: number;
    version: number;
    created_at: Date;
}