import { AbstractTable } from "../../tables/abstractTable";
import { Expr } from "../requestBuilders/where";
import { Aggregator } from "./abstractAggregator";

export class DeleteAggregator<SERVICE, DB> extends Aggregator<SERVICE, DB> {
    private _from: Array<string> = [];
    private _filters: Array<string> = [];
    private _delete: Array<string> = ["DELETE"];

    constructor(table: AbstractTable<SERVICE, DB>){
        super(table);
    }

    filters(filters: Expr): DeleteAggregator<SERVICE, DB> {
        this._filters.push("WHERE ");
        this._filters.push(filters.toQuery());
        return this;
    }

    appendFrom(table: AbstractTable<SERVICE, DB>): DeleteAggregator<SERVICE, DB> {
        this._from.push(" FROM ");
        this._from.push(table.tableName());
        return this
    }

    buildQuery() {
        // this._delete.push(this._fields.join(''));
        this._delete.push("\n");
        this._delete.push(this._from.join(''));
        this._delete.push("\n");
        this._delete.push(this._filters.join(''));

        return this._delete.join('');
    }
}