import { ColumnType } from "../../columns/types/columnType";
import { AbstractTable } from "../../tables/abstractTable";
import { Join } from "../joinBuilders/join";
import { Expr } from "../requestBuilders/where";
import { SelectAggregator } from "../aggregators/";

export class Select {
    // TODO Add from with tableName as param
    static from(table: AbstractTable) {
        const aggregator = new SelectAggregator(table)
        aggregator.appendFrom(table).appendFields();
        return new SelectFrom(aggregator);
    }
}

class SelectFrom {
    private _aggregator: SelectAggregator;

    constructor(aggregator: SelectAggregator){
        this._aggregator = aggregator;
    }

    joined<COLUMN extends ColumnType>(joins: Array<Join<COLUMN, {}>>) {
        return new SelectJoined(this._aggregator).apply(joins);
    }

    filteredBy(filters: Expr) {
        return new WhereSelect(this._aggregator).apply(filters);
    }

    build() {
        return this._aggregator.buildQuery();
    }
}

class SelectJoined {
    private _aggregator: SelectAggregator;

    constructor(aggregator: SelectAggregator){
        this._aggregator = aggregator;
    }

    apply<COLUMN extends ColumnType>(joins: Array<Join<COLUMN, {}>>): SelectJoined {
        this._aggregator.join(joins);
        return this;
    }

    filteredBy(filters: Expr) {
        return new WhereSelect(this._aggregator).apply(filters);
    }

    build() {
        return this._aggregator.buildQuery();
    }
}

class WhereSelect {
    private _aggregator: SelectAggregator;

    constructor(aggregator: SelectAggregator){
        this._aggregator = aggregator;
    }

    apply(filters: Expr): WhereSelect {
        this._aggregator.filters(filters);
        return this;
    }

    build() {
        return this._aggregator.buildQuery();
    }
}