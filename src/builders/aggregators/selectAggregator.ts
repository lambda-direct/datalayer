import { ColumnType } from "../../columns/types/columnType";
import { AbstractTable } from "../../tables/abstractTable";
import { Join } from "../joinBuilders/join";
import { Expr } from "../requestBuilders/where";
import { Aggregator } from "./abstractAggregator";

export class SelectAggregator<SERVICE, MODEL> extends Aggregator<SERVICE, MODEL> {
    private _from: Array<string> = [];
    private _filters: Array<string> = [];
    private _select: Array<string> = ["SELECT"];
    private _join: Array<string> = [];

    constructor(table: AbstractTable<SERVICE, MODEL>){
        super(table);
    }

    filters(filters: Expr): SelectAggregator<SERVICE, MODEL> {
        this._filters.push("WHERE ");
        this._filters.push(filters.toQuery());
        return this;
    }

    appendFrom(table: AbstractTable<SERVICE, MODEL>): SelectAggregator<SERVICE, MODEL> {
        this._from.push(" FROM ");
        this._from.push(table.tableName());
        return this
    }

    // Add select generator for second table also
    join<COLUMN extends ColumnType>(joins: Array<Join<COLUMN, {}, MODEL>>): SelectAggregator<SERVICE, MODEL> {
        for (const join of joins) {
            const tableFrom = join.fromColumn.getParent();
            const tableTo = join.toColumn.getParent();
            const type = join.type;

            const selectString = this.generateSelectArray(tableTo).join('');
            this._fields.push(', ');
            this._fields.push(selectString);
            this._join.push('\n');
            this._join.push(type);
            this._join.push(" ");
            this._join.push(tableTo.tableName());
            this._join.push('\n');
            this._join.push('ON ');
            this._join.push(tableFrom.tableName());
            this._join.push('.');
            this._join.push(join.fromColumn.columnName);
            this._join.push(' = ');
            this._join.push(tableTo.tableName());
            this._join.push('.');
            this._join.push(join.toColumn.columnName);
        }   
        return this;
    }

    buildQuery() {
        this._select.push(this._fields.join(''));
        this._select.push("\n");
        this._select.push(this._from.join(''));
        this._select.push("\n");
        this._select.push(this._join.join(''));
        this._select.push("\n");
        this._select.push(this._filters.join(''));

        return this._select.join('');
    }
}