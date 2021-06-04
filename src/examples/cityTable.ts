import { Column } from "..";
import { AbstractTable, RowMapper } from "../tables/abstractTable";

export class CitiesTable extends AbstractTable<CitiesModel> {
    name = this.varchar({name: "name", size: 256});
    page = this.varchar({name: "page", size: 256});
    userId = this.int({name:'user_id'})

    tableName(): string {
        return "citiess";
    }

    map(response: RowMapper): CitiesModel {
        return {
            name: response.getVarchar(this.name),
            page: response.getVarchar(this.page),
        };
    }
}

export interface CitiesModel {
    name: string;
    page: string;
}