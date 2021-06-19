import { Column } from "../columns/column";
import { ColumnType } from "../columns/types/columnType";
import { AbstractTable, RowMapper } from "../tables/abstractTable";

export class CitiesTable extends AbstractTable<CitiesModel> {
    readonly name = this.timestamp({name: "name"});
    readonly page = this.varchar({name: "page", size: 256}).isNullable();
    readonly userId = this.int({name: "user_id"})
    readonly data = this.jsonb<string[]>({name:'data'})

    mapServiceToDb(): {[name in keyof CitiesModel]: Column<ColumnType>} {
        return {
            name: this.name,
            page: this.page,
            userId: this.userId,
            data: this.data
        };
    }

    tableName(): string {
        return "citiess";
    }
}

export interface CitiesModel {
    name: Date;
    page: string | null;
    userId: number;
    data: string[]
}