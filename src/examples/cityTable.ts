import { AbstractTable, RowMapper } from "../tables/abstractTable";

export class CitiesTable extends AbstractTable<CitiesModel, DbCity> {
    name = this.timestamp({name: "name"});
    page = this.varchar({name: "page", size: 256});
    userId = this.int({name: "user_id"})

    tableName(): string {
        return "citiess";
    }

    toServiceModel(response: RowMapper): CitiesModel {
        return {
            name: response.getTimestamp(this.name),
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
    name: Date;
    page: string;
    user_id: number
}

export interface CitiesModel {
    name: Date;
    page: string;
    userId: number
}