import { AbstractTable } from "@/tables/abstractTable";
import { SelectAggregator } from "./aggregator";

export class Select {
    static from(table: AbstractTable) {
        const aggregator = new SelectAggregator()
        aggregator.appendFrom(table).appendFields(table);
        return new SelectFrom(aggregator);
    }
}

class SelectFrom {
    private _aggregator: SelectAggregator;

    constructor(aggregator: SelectAggregator){
        this._aggregator = aggregator;
    }

    build() {
        return this._aggregator.buildQuery();
    }
}