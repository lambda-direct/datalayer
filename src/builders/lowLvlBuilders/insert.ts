import { AbstractTable } from "../../tables/abstractTable";
import { UpdateExpr } from "../requestBuilders/updates";
import { InsertAggregator } from "../aggregators";

export class Insert {
    static into<SERVICE>(table: AbstractTable<SERVICE>) {
        const aggregator = new InsertAggregator(table)
        aggregator.appendFrom(table).appendFields();
        return new InsertInto(aggregator);
    }
}

class InsertInto<SERVICE> {
    private _aggregator: InsertAggregator<SERVICE>;

    constructor(aggregator: InsertAggregator<SERVICE>){
        this._aggregator = aggregator;
    }

    values<T>(values: Array<T>) {
        return new ValuesInsert(this._aggregator).apply(values);
    }

    build() {
        return this._aggregator.buildQuery();
    }
}

class ValuesInsert<SERVICE> {
    private _aggregator: InsertAggregator<SERVICE>;

    constructor(aggregator: InsertAggregator<SERVICE>){
        this._aggregator = aggregator;
    }

    apply<T>(values: Array<T>): ValuesInsert<SERVICE> {
        this._aggregator.appendColumns(values);
        this._aggregator.appendValues(values);

        return this;
    }

    onConflict<T>(updates: UpdateExpr) {
        return new OnConflictInsert(this._aggregator).apply(updates);
    }

    build() {
        return this._aggregator.buildQuery();
    }
}

class OnConflictInsert<SERVICE> {
    private _aggregator: InsertAggregator<SERVICE>;

    constructor(aggregator: InsertAggregator<SERVICE>){
        this._aggregator = aggregator;
    }

    apply(updates: UpdateExpr): OnConflictInsert<SERVICE> {
        this._aggregator.appendOnConflict(updates);
        return this;
    }

    build() {
        return this._aggregator.buildQuery();
    }
}