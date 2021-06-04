import { Column } from "../columns/column";
import { AbstractTable } from "../tables/abstractTable";

export class Create {
    private table: Array<string> = [];
    private columns: Array<string> = [];
    private primaryKey: Array<string> = [];
    private uniqueKey: Array<string> = [];
    private tableClass: AbstractTable<any>;

    private constructor(tableClass: AbstractTable<any>) {
        this.tableClass = tableClass;
    }

    static from(tableClass: AbstractTable<any>): Create {
        return new Create(tableClass);
    }

    build(): string {
        this.table.push("CREATE TABLE IF NOT EXISTS ")
        this.table.push(this.tableClass.tableName())
        this.table.push(" (");

        const values = Object.values(this.tableClass);
        for (let i = 0; i < values.length; i++) {
            const column = values[i];

            if (column instanceof Column){
                this.columns.push(column.getColumnName());
                this.columns.push(" ");
                this.columns.push(column.isAutoIncrement() ? "SERIAL" : column.getColumnType().getDbName());
                this.columns.push(" ");
                this.columns.push(column.getDefaultValue() != null ? "DEFAULT " + column.getDefaultValue() : "");
                this.columns.push(column.getIsNullable() ? "" : "NOT NULL");

                const referenced: Column<any> = column.getReferenced();
                this.columns.push(referenced != null ? " REFERENCES " + referenced.getParent().tableName() + " (" + referenced.getColumnName() + ")" : "");

                if (i < values.length - 1) {
                    this.columns.push(",");
                }
            }
        };

        if (this.tableClass.getPrimaryKeys().length !== 0) {
            this.columns.push(",");
            this.primaryKey.push("\nCONSTRAINT " + this.tableClass.tableName() + "_" + this.tableClass.getPrimaryKeys()[0].getColumnName());
            this.primaryKey.push(" PRIMARY KEY(");

            for (let i = 0; i < this.tableClass.getPrimaryKeys().length; i++) {
                const column: Column<any> = this.tableClass.getPrimaryKeys()[i];
                this.primaryKey.push(column.getColumnName());

                if (i != this.tableClass.getPrimaryKeys().length - 1) {
                    this.primaryKey.push(",");
                }
            }
            this.primaryKey.push(")");
        }

        if (this.tableClass.getUniqueKeys().length !== 0) {
            const columnName: string = this.tableClass.getUniqueKeys()[0].getColumnName();
            this.uniqueKey.push(",");
            this.uniqueKey.push("\nCONSTRAINT " + this.tableClass.tableName() + "_" + columnName);
            this.uniqueKey.push(" UNIQUE(");

            for (let i = 0; i < this.tableClass.getUniqueKeys().length; i++) {
                const column: Column<any> = this.tableClass.getUniqueKeys()[i];
                this.uniqueKey.push(column.getColumnName());

                if (i != this.tableClass.getUniqueKeys().length - 1) {
                    this.uniqueKey.push(",");
                }
            }
            this.uniqueKey.push(")");
        }

        return this.table.join("") + this.columns.join("") + this.primaryKey.join("") + this.uniqueKey.join("") + ");";
    }
}