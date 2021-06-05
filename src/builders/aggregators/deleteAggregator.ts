import { AbstractTable } from "../../tables/abstractTable";
import { Expr } from "../requestBuilders/where";
import { Aggregator } from "./abstractAggregator";

export class DeleteAggregator extends Aggregator {
    private _from: Array<string> = [];
    private _filters: Array<string> = [];
    private _delete: Array<string> = [];

    constructor(table: AbstractTable){
        super(table);
    }

    filters(filters: Expr): DeleteAggregator {
        this._filters.push("WHERE ");
        this._filters.push(filters.toQuery());
        return this;
    }

    appendFrom(table: AbstractTable): DeleteAggregator {
        this._from.push(" FROM ");
        this._from.push(table.tableName());
        return this
    }

    buildQuery() {
        this._delete.push(this._fields.join(''));
        this._delete.push("\n");
        this._delete.push(this._from.join(''));
        this._delete.push("\n");
        this._delete.push(this._filters.join(''));

        return this._delete.join('');
    }
}