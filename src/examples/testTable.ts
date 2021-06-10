import { AbstractTable, RowMapper } from "../tables/abstractTable";

export class TestTable extends AbstractTable<TestsTable> {
    id = this.int({name: "id"}).autoIncrement().primaryKey();
    name = this.varchar({name: "name", size: 256});
    url = this.text({name: "url"}).isNullable();
    price = this.decimal({name: "price", precision: 15, scale: 2});
    deleted = this.bool({name: "deleted"}).defaultValue(false);
    created_at = this.timestamp({name: "created_at"});
    updated_at = this.time({name: "updated_at"});

    tableName(): string {
        return "tests";
    }

    map(res: RowMapper): TestsTable {
        return {
            id: res.getInt(this.id),
            name: res.getVarchar(this.name),
            url: res.getText(this.url),
            price: res.getDecimal(this.price),
            deleted: res.getBool(this.deleted),
            created_at: res.getTimestamp(this.created_at),
            updated_at: res.getTime(this.updated_at),
        };
    }
}

export interface TestsTable {
    id?: number;
    name: string;
    url: string;
    price: number;
    deleted: boolean;
    created_at: Date;
    updated_at: Date;
}