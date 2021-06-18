import { Column } from "../columns/column";
import { ColumnType } from "../columns/types/columnType";
import { AbstractTable, RowMapper } from "../tables/abstractTable";

export class CitiesTable extends AbstractTable<CitiesModel, DbCity> {
    readonly name = this.timestamp({name: "name"});
    readonly page = this.varchar({name: "page", size: 256});
    readonly userId = this.int({name: "user_id"})
    readonly data = this.jsonb<string[]>({name:'data'})

    toTest(): {[name in keyof CitiesModel]: Column<ColumnType>} {
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

    toServiceModel(response: RowMapper): CitiesModel {
        return {
            name: response.getTimestamp(this.name),
            page: response.getVarchar(this.page),
            userId: response.getInt(this.userId),
            data: response.getJsonb<string[]>(this.data)
        };
    }

    toDbModel(citiesModel: CitiesModel): DbCity {
        return {
            name: citiesModel.name,
            page: citiesModel.page,
            user_id: citiesModel.userId,
            data: citiesModel.data
        };
    }
}

interface DbCity {
    name: Date;
    page: string;
    user_id: number;
    data: string[]
}

export interface CitiesModel {
    name: Date;
    page: string;
    userId: number;
    data: string[]
}