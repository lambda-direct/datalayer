import { AbstractTable, RowMapper } from "../tables/abstractTable";

export class MigrationsTable extends AbstractTable<MigrationsModel, DbMigration> {
    id = this.int({name: "id"}).autoIncrement().primaryKey();
    version = this.int({name: "version"}).unique();
    created_at = this.timestamp({name: "created_at"});

    tableName(): string {
        return "migrations";
    }

    toServiceModel(response: RowMapper): MigrationsModel {
        return {
            id: response.getInt(this.id),
            version: response.getInt(this.version),
            createdAt: response.getTimestamp(this.created_at),
        };
    }
    toDbModel(response: MigrationsModel): DbMigration {
        return {
            version: response.version,
            created_at: response.createdAt
        }
    }
}

export interface MigrationsModel {
    id?: number;
    version: number;
    createdAt: Date;
}

interface DbMigration {
    id?: number;
    version: number;
    created_at: Date;
}