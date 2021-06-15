import { AbstractTable, RowMapper } from "../tables/abstractTable";

export class UsersTable extends AbstractTable<UsersModel, DbUser> {
    id = this.int({name: "id"}).autoIncrement().primaryKey()
    name = this.varchar({name: "name", size: 256});
    city = this.varchar({name: "city", size: 256});
    country = this.varchar({name: "country", size: 256});

    tableName(): string {
        return "users";
    }

    toServiceModel(response: RowMapper): UsersModel {
        return {
            name: response.getVarchar(this.name),
            city: response.getVarchar(this.city),
            country: response.getVarchar(this.country),
        };
    }

    toDbModel(response: UsersModel): DbUser {
        return response;
    }

    map(response: RowMapper): UsersModel {
        return {
            name: response.getVarchar(this.name),
            city: response.getVarchar(this.city),
            country: response.getVarchar(this.country),
        };
    }
}

interface DbUser {
    name: string;
    city: string;
    country: string;
}

export interface UsersModel {
    name: string;
    city: string;
    country: string;
}