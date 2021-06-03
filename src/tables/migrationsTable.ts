import { AbstractTable, RowMapper } from "../tables/abstractTable";

export class MigrationsTable extends AbstractTable<MigrationsModel> {
    id = this.number({name: "id"}).autoIncrement().primaryKey();
    version = this.number({name: "version"});
    created_at = this.timestamp({name: "created_at"});

    tableName(): string {
        return "migrations";
    }

    map(response: RowMapper): MigrationsModel {
        return {
            id: response.getNumber(this.id),
            version: response.getNumber(this.version),
            created_at: response.getTimestamp(this.created_at),
        };
    }
}

export interface MigrationsModel {
    id: number;
    version: number;
    created_at: Date;
}