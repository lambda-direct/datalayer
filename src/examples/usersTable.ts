import { AbstractTable, RowMapper } from "../tables/abstractTable";

export class UsersTable extends AbstractTable<UsersModel> {
    name = this.varchar("name", 256);
    city = this.varchar("city", 256);
    country = this.varchar("country", 256);

    tableName(): string {
        return "userss";
    }

    protected map(response: RowMapper): UsersModel {
        return {
            name: response.getVarchar(this.name),
            city: response.getVarchar(this.city),
            country: response.getVarchar(this.country),
        } as UsersModel
    }
}

interface UsersModel {
    name: string;
    city: string;
    country: string;
}