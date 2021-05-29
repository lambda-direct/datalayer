import { AbstractTable, RowMapper } from "../tables/abstractTable";

export class UsersTable extends AbstractTable<UsersModel> {
    name = this.varchar({name: "name", size: 256});
    city = this.varchar({name: "city", size: 256});
    country = this.varchar({name: "country", size: 256});

    tableName(): string {
        return "userss";
    }

    map(response: RowMapper): UsersModel {
        return {
            name: response.getVarchar(this.name),
            city: response.getVarchar(this.city),
            country: response.getVarchar(this.country),
        } as UsersModel
    }
}

export interface UsersModel {
    name: string;
    city: string;
    country: string;
}