import { AbstractTable } from '../../tables/abstractTable';
import { UpdateExpr } from '../requestBuilders/updates';
import { Expr } from '../requestBuilders/where';
import { UpdateAggregator } from '../aggregators';


export class Update {
    static in<SERVICE>(table: AbstractTable<SERVICE>){
        const aggregator = new UpdateAggregator(table)
        aggregator.appendFrom(table).appendFields();
        return new UpdateIn(aggregator);
    }
}

class UpdateIn<SERVICE, DB> {
    private _aggregator: UpdateAggregator<SERVICE>;

    constructor(aggregator: UpdateAggregator<SERVICE>){
        this._aggregator = aggregator;
    }

    set(updates: UpdateExpr) {
        return new WhereSet(this._aggregator).apply(updates);
    }

    build() {
        return this._aggregator.buildQuery();
    }
}

class WhereSet<SERVICE, DB> {
    private _aggregator: UpdateAggregator<SERVICE>;

    constructor(aggregator: UpdateAggregator<SERVICE>){
        this._aggregator = aggregator;
    }

    apply(updates: UpdateExpr): WhereSet<SERVICE, DB> {
        this._aggregator.set(updates);
        return this;
    }

    filteredBy(filters: Expr) {
        return new WhereSelect(this._aggregator).apply(filters);
    }

    build() {
        return this._aggregator.buildQuery();
    }
}

class WhereSelect<SERVICE, DB> {
    private _aggregator: UpdateAggregator<SERVICE>;

    constructor(aggregator: UpdateAggregator<SERVICE>){
        this._aggregator = aggregator;
    }

    apply(filters: Expr): WhereSelect<SERVICE, DB> {
        this._aggregator.where(filters);
        return this;
    }

    build() {
        return this._aggregator.buildQuery();
    }
}