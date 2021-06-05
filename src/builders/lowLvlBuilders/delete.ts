import { AbstractTable } from "../../tables/abstractTable";
import { Expr } from "../requestBuilders/where";
import { DeleteAggregator } from "../aggregators";

export class Delete {
    static from(table: AbstractTable) {
        const aggregator = new DeleteAggregator(table)
        aggregator.appendFrom(table).appendFields();
        return new DeleteFrom(aggregator);
    }
}

class DeleteFrom {
    private _aggregator: DeleteAggregator;

    constructor(aggregator: DeleteAggregator){
        this._aggregator = aggregator;
    }

    build() {
        return this._aggregator.buildQuery();
    }

    filteredBy(filters: Expr) {
        return new DeleteFilter(this._aggregator).apply(filters);
    }
}

class DeleteFilter {
    private _aggregator: DeleteAggregator;

    constructor(aggregator: DeleteAggregator){
        this._aggregator = aggregator;
    }

    apply(filters: Expr): DeleteFilter {
        this._aggregator.filters(filters);
        return this;
    }

    build() {
        return this._aggregator.buildQuery();
    }
}