import { Column } from "..";
import { AbstractTable, RowMapper } from "../tables/abstractTable";

export class UsersTable extends AbstractTable<UsersModel> {
    id = this.int({name: "id"}).autoIncrement().primaryKey()
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
        };
    }

    getPrimaryKeys(): Column<any>[] {
        if (this.primaryKeys.length === 0) {
            this.primaryKeys.push(this.id);
        }
        return this.primaryKeys;
    }

    getUniqueKeys(): Column<any>[] {
        return this.uniqueKeys;
    }
}

export interface UsersModel {
    name: string;
    city: string;
    country: string;
}