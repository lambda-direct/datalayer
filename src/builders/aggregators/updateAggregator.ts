import { AbstractTable } from "../../tables/abstractTable";
import { UpdateExpr } from "../requestBuilders/updates";
import { Expr } from "../requestBuilders/where";
import { Aggregator } from "./abstractAggregator";

export class UpdateAggregator<SERVICE, MODEL> extends Aggregator<SERVICE, MODEL> {
    private _updates: Array<string> = [];
    private _filters: Array<string> = [];
    private _from: Array<string> = [];
    private _update: Array<string> = ["UPDATE"];

    constructor(table: AbstractTable<SERVICE, MODEL>){
        super(table);
    }

    where(filters: Expr): UpdateAggregator<SERVICE, MODEL> {
        this._filters.push("WHERE ");
        this._filters.push(filters.toQuery());
        return this;
    }

    appendFrom(table: AbstractTable<SERVICE, MODEL>): UpdateAggregator<SERVICE, MODEL> {
        this._from.push(" ");
        this._from.push(table.tableName());
        return this;
    }

    set(updates: UpdateExpr): UpdateAggregator<SERVICE, MODEL> {
        this._updates.push(`\nSET ${updates.toQuery()}`);
        return this;
    }

    buildQuery() {
        this._update.push(this._from.join(''));
        this._update.push("\n");
        this._update.push(this._updates.join(''));
        this._update.push("\n");
        this._update.push(this._filters.join(''));
        this._update.push("\n");
        this._update.push("RETURNING");
        this._update.push("\n");
        this._update.push(this._fields.join(''));

        return this._update.join('');
    }
}