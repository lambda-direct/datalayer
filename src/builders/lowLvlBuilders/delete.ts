import { AbstractTable } from "../../tables/abstractTable";
import { Expr } from "../requestBuilders/where";
import { DeleteAggregator } from "../aggregators";

export class Delete<SERVICE, DB> {
    static from<SERVICE, DB>(table: AbstractTable<SERVICE>): DeleteFrom<SERVICE, DB> {
        const aggregator = new DeleteAggregator(table)
        aggregator.appendFrom(table).appendFields();
        return new DeleteFrom(aggregator);
    }
}

class DeleteFrom<SERVICE, DB> {
    private _aggregator: DeleteAggregator<SERVICE>;

    constructor(aggregator: DeleteAggregator<SERVICE>){
        this._aggregator = aggregator;
    }

    build() {
        return this._aggregator.buildQuery();
    }

    filteredBy(filters: Expr) {
        return new DeleteFilter(this._aggregator).apply(filters);
    }
}

class DeleteFilter<SERVICE, DB> {
    private _aggregator: DeleteAggregator<SERVICE>;

    constructor(aggregator: DeleteAggregator<SERVICE>){
        this._aggregator = aggregator;
    }

    apply(filters: Expr): DeleteFilter<SERVICE, DB> {
        this._aggregator.filters(filters);
        return this;
    }

    build() {
        return this._aggregator.buildQuery();
    }
}