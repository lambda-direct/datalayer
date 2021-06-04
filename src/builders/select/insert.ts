import { AbstractTable } from "../../tables/abstractTable";
import { UpdateExpr, Updates } from "../updates";
import { InsertAggregator } from "./aggregator";

export class Insert {
    static into(table: AbstractTable) {
        const aggregator = new InsertAggregator(table)
        aggregator.appendFrom(table).appendFields();
        return new InsertInto(aggregator);
    }
}

class InsertInto {
    private _aggregator: InsertAggregator;

    constructor(aggregator: InsertAggregator){
        this._aggregator = aggregator;
    }

    values<T>(values: Array<T>) {
        return new ValuesInsert(this._aggregator).apply(values);
    }

    build() {
        return this._aggregator.buildQuery();
    }
}

class ValuesInsert {
    private _aggregator: InsertAggregator;

    constructor(aggregator: InsertAggregator){
        this._aggregator = aggregator;
    }

    apply<T>(values: Array<T>): ValuesInsert {
        // deleting id (id is SERIAL)
        values.map((value: Object) => Reflect.deleteProperty(value, 'id'));

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

class OnConflictInsert {
    private _aggregator: InsertAggregator;

    constructor(aggregator: InsertAggregator){
        this._aggregator = aggregator;
    }

    apply(updates: UpdateExpr): OnConflictInsert {
        this._aggregator.appendOnConflict(updates);
        return this;
    }

    build() {
        return this._aggregator.buildQuery();
    }
}