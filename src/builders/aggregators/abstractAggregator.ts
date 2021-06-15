import { Column } from "../../columns/column";
import { AbstractTable } from "../../tables/abstractTable";
import { ecranate } from "../../utils/ecranate";

export class Aggregator<SERVICE, MODEL> {
    protected _fields: Array<string> = [];
    protected _table: AbstractTable<SERVICE, MODEL>;

    constructor(table: AbstractTable<SERVICE, MODEL>){
        this._table = table;
    }

    protected generateSelectArray(table: AbstractTable<{},{}>) {
        const selectFields = [];
        for (let field of Object.values(table)) {
            if (field instanceof Column){
                selectFields.push(" ");
                selectFields.push(table.tableName());
                selectFields.push(".");
                selectFields.push(ecranate(field.columnName));
                selectFields.push(" AS ");
                selectFields.push(ecranate(`${table.tableName().replace(".", "_")}_${field.columnName}`))
                selectFields.push(",");
            }
        };
        selectFields.pop();
        return selectFields;
    }

    appendFields() {
        this._fields = this.generateSelectArray(this._table)
    }
}