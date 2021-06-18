import { Column, ColumnType } from "..";
import { AbstractTable, RowMapper } from "../tables/abstractTable";

export class MigrationsTable extends AbstractTable<MigrationsModel> {
    id = this.int({name: "id"}).autoIncrement().primaryKey();
    version = this.int({name: "version"}).unique();
    created_at = this.timestamp({name: "created_at"});

    tableName(): string {
        return "migrations";
    }

    mapServiceToDb(): {[name in keyof MigrationsModel]: Column<ColumnType>}{
        return {
            id: this.id,
            version: this.version,
            createdAt: this.created_at
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