import { AbstractTable } from "../tables/abstractTable";

export class UsersTable extends AbstractTable {
    name = this.varchar("name", 256);
    city = this.varchar("city", 256);
    country = this.varchar("country", 256);

    tableName(): string {
        return "userss";
    }
}