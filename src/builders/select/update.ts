import { AbstractTable } from '../../tables/abstractTable';
import { UpdateExpr } from '../updates';
import { Expr } from '../where';
import { UpdateAggregator } from './aggregator';


export class Update {
    static in(table: AbstractTable){
        const aggregator = new UpdateAggregator(table)
        aggregator.appendFrom(table).appendFields();
        return new UpdateIn(aggregator);
    }
}

class UpdateIn {
    private _aggregator: UpdateAggregator;

    constructor(aggregator: UpdateAggregator){
        this._aggregator = aggregator;
    }

    set(updates: UpdateExpr) {
        return new WhereSet(this._aggregator).apply(updates);
    }

    build() {
        return this._aggregator.buildQuery();
    }
}

class WhereSet {
    private _aggregator: UpdateAggregator;

    constructor(aggregator: UpdateAggregator){
        this._aggregator = aggregator;
    }

    apply(updates: UpdateExpr): WhereSet {
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

class WhereSelect {
    private _aggregator: UpdateAggregator;

    constructor(aggregator: UpdateAggregator){
        this._aggregator = aggregator;
    }

    apply(filters: Expr): WhereSelect {
        this._aggregator.where(filters);
        return this;
    }

    build() {
        return this._aggregator.buildQuery();
    }
}