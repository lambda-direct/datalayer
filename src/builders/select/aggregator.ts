import { Column } from "../../columns/column";
import { AbstractTable } from "../../tables/abstractTable";
import { ecranate } from "../../utils/ecranate";
import { UpdateExpr } from "../updates";
import { Expr } from "../where";

class Aggregator {
    protected _fields: Array<string> = [];
    protected _table: AbstractTable;

    constructor(table: AbstractTable){
        this._table = table;
    }

    appendFields() {
        for (let field of Object.values(this._table)) {
            if (field instanceof Column){
                this._fields.push(" ");
                this._fields.push(this._table.tableName());
                this._fields.push(".");
                this._fields.push(ecranate(field.columnName));
                this._fields.push(" AS ");
                this._fields.push(ecranate(`${this._table.tableName().replace(".", "_")}_${field.columnName}`))
                this._fields.push(",");
            }
        }
        this._fields.pop()
    }
}

export class SelectAggregator extends Aggregator {
    private _from: Array<string> = [];
    private _filters: Array<string> = [];
    private _select: Array<string> = ["SELECT"];

    constructor(table: AbstractTable){
        super(table);
    }

    filters(filters: Expr): SelectAggregator {
        this._filters.push("WHERE ");
        this._filters.push(filters.toQuery());
        return this;
    }

    appendFrom(table: AbstractTable): SelectAggregator {
        this._from.push(" FROM ");
        this._from.push(table.tableName());
        return this
    }

    buildQuery() {
        this._select.push(this._fields.join(''));
        this._select.push("\n");
        this._select.push(this._from.join(''));
        this._select.push("\n");
        this._select.push(this._filters.join(''));

        return this._select.join('');
    }
}

export class UpdateAggregator extends Aggregator {
    private _updates: Array<string> = [];
    private _filters: Array<string> = [];
    private _from: Array<string> = [];
    private _update: Array<string> = ["UPDATE"];

    constructor(table: AbstractTable){
        super(table);
    }

    where(filters: Expr): UpdateAggregator {
        this._filters.push("WHERE ");
        this._filters.push(filters.toQuery());
        return this;
    }

    appendFrom(table: AbstractTable): UpdateAggregator {
        this._from.push(" ");
        this._from.push(table.tableName());
        return this;
    }

    set(updates: UpdateExpr): UpdateAggregator {
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