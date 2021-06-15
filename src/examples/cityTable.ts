import { AbstractTable, RowMapper } from "../tables/abstractTable";

export class CitiesTable extends AbstractTable<CitiesModel, DbCity> {
    name = this.varchar({name: "name", size: 256});
    page = this.varchar({name: "page", size: 256});
    userId = this.int({name: "user_id"})

    tableName(): string {
        return "citiess";
    }

    toServiceModel(response: RowMapper): CitiesModel {
        return {
            name: response.getVarchar(this.name),
            page: response.getVarchar(this.page),
            userId: response.getInt(this.userId)
        };
    }

    toDbModel(citiesModel: CitiesModel): DbCity {
        return {
            name: citiesModel.name,
            page: citiesModel.page,
            user_id: citiesModel.userId
        };
    }
}

interface DbCity {
    name: string;
    page: string;
    user_id: number
}

export interface CitiesModel {
    name: string;
    page: string;
    userId: number
}