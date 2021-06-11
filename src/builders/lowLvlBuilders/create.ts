import { Column } from "../../columns/column";
import { AbstractTable } from "../../tables/abstractTable";

export class Create {
    private tableBuilder: Array<string> = [];
    private columnsBuilder: Array<string> = [];
    private primaryKey: Array<string> = [];
    private uniqueKey: Array<string> = [];
    private tableClass: AbstractTable<any>;

    private constructor(tableClass: AbstractTable<any>) {
        this.tableClass = tableClass;
    }

    static table(tableClass: AbstractTable<any>): Create {
        return new Create(tableClass);
    }

    build(): string {
        this.tableBuilder.push("CREATE TABLE IF NOT EXISTS ")
        this.tableBuilder.push(this.tableClass.tableName())
        this.tableBuilder.push(" (");

        const tableValues = Object.values(this.tableClass);
        const columns = tableValues.filter(value => value instanceof Column);
        
        for (let i = 0; i < columns.length; i++) {
            const column = columns[i];

            if (column instanceof Column) {
                this.columnsBuilder.push(column.getColumnName());
                this.columnsBuilder.push(" ");
                this.columnsBuilder.push(column.isAutoIncrement() ? "SERIAL" : column.getColumnType().getDbName());
                this.columnsBuilder.push(" ");
                this.columnsBuilder.push(column.getDefaultValue() != null ? "DEFAULT " + column.getDefaultValue() : "");
                this.columnsBuilder.push(column.getIsNullable() ? "" : " NOT NULL");

                const referenced: Column<any> = column.getReferenced();
                this.columnsBuilder.push(referenced != null ? " REFERENCES " + referenced.getParent().tableName() + " (" + referenced.getColumnName() + ")" : "");

                if (i != columns.length - 1) {
                    this.columnsBuilder.push(",");
                }
            }
        };

        const primaryKeys: Column<any>[] = []
        const uniqueKeys: Column<any>[] = []
        for (let field of Object.values(this.tableClass)) {
            if (field instanceof Column) {
                if (field.primaryKeyName){
                    primaryKeys.push(field)
                }
                if (field.uniqueKeyName){
                    uniqueKeys.push(field)
                }
            }
        }

        if (primaryKeys.length !== 0) {
            this.primaryKey.push(",");
            this.primaryKey.push("\nCONSTRAINT " + this.tableClass.tableName() + "_" + primaryKeys[0].getColumnName());
            this.primaryKey.push(" PRIMARY KEY(");

            for (let i = 0; i < primaryKeys.length; i++) {
                const column: Column<any> = primaryKeys[i];
                this.primaryKey.push(column.getColumnName());

                if (i != primaryKeys.length - 1) {
                    this.primaryKey.push(",");
                }
            }
            this.primaryKey.push(")");
        }

        if (uniqueKeys.length !== 0) {
            const columnName: string = uniqueKeys[0].getColumnName();
            this.uniqueKey.push(",");
            this.uniqueKey.push("\nCONSTRAINT " + this.tableClass.tableName() + "_" + columnName);
            this.uniqueKey.push(" UNIQUE(");

            for (let i = 0; i < uniqueKeys.length; i++) {
                const column: Column<any> = uniqueKeys[i];
                this.uniqueKey.push(column.getColumnName());

                if (i != uniqueKeys.length - 1) {
                    this.uniqueKey.push(",");
                }
            }
            this.uniqueKey.push(")");
        }

        return this.tableBuilder.join("") + this.columnsBuilder.join("") + this.primaryKey.join("") + this.uniqueKey.join("") + ");";
    }
}