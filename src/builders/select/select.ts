import { AbstractTable } from "../../tables/abstractTable";
import { Expr } from "../where";
import { SelectAggregator } from "./aggregator";

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