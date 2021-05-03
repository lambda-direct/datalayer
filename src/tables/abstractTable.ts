import { Column } from "@/columns/column";

export abstract class AbstractTable {
    protected varchar(name: string, size: number) {
        return Column.varchar(name, size);
    }

    abstract tableName(): string;
}