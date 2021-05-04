import { Column } from "../../columns/column";
import { AbstractTable } from "../../tables/abstractTable";

export class SelectAggregator {
    private _from: Array<string> = [];
    private _fields: Array<string> = [];
    private _select: Array<string> = ["SELECT"];

    // ToDo provide table in constructor
    appendFields(table: AbstractTable) {
        for (let field of Object.values(table)) {
            if (field instanceof Column){
                this._fields.push(" ");
                this._fields.push(table.tableName());
                this._fields.push(".");
                this._fields.push("\"");
                this._fields.push(field.columnName);
                this._fields.push("\"");
                this._fields.push(" AS ");
                this._fields.push("\"");
                this._fields.push(table.tableName().replace(".", "_"));
                this._fields.push("_");
                this._fields.push(field.columnName);
                this._fields.push("\"");
                this._fields.push(",");
            }
        }
        this._fields.pop()
    }

    appendFrom(table: AbstractTable): SelectAggregator {
        this._from.push(" FROM ");
        this._from.push(table.tableName());
        return this
    }

    buildQuery() {
        this._select.push(this._fields.join(''));
        this._select.push(this._from.join(''));

        return this._select.join('');
    }
}