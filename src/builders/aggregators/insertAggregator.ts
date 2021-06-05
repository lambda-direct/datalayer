import { AbstractTable } from "../../tables/abstractTable";
import { shouldEcranate } from "../../utils/ecranate";
import { UpdateExpr } from "../requestBuilders/updates";
import { Aggregator } from "./abstractAggregator";

export class InsertAggregator extends Aggregator {
    private _onConflict: Array<string> = [];
    private _columns: Array<string> = [];
    private _values: Array<string> = [];
    private _from: Array<string> = [];
    private _insert: Array<string> = ["INSERT INTO"];

    constructor(table: AbstractTable){
        super(table);
    }

    appendFrom(table: AbstractTable): InsertAggregator {
        this._from.push(" ");
        this._from.push(table.tableName());
        this._table = table;
        return this;
    }

    appendColumns<T> (values: Array<T>) {
        //@TODO Check if values not empty
        const columns = Object.keys(values[0]);

        for(let i = 0; i < columns.length; i++) {
            const column = columns[i];

            this._columns.push("\"")
            this._columns.push(column)
            this._columns.push("\"")

            if (i < columns.length - 1) {
                this._columns.push(", ")
            }
        }
    }

    appendValues<T> (values: Array<T>) {
        //@TODO Check if values not empty
        for(let i = 0; i < values.length; i++) {
            const value = values[i];
            const insertValues = Object.values(value);

            this._values.push("(");
            for(let j = 0; j < insertValues.length; j++) {
                const insertValue = insertValues[j];    

                if (shouldEcranate(insertValue)) {
                    let ecranatedValue = insertValue;
                    if (insertValue instanceof String) ecranatedValue = insertValue.replace("'", "''");
                    if (insertValue instanceof Date) ecranatedValue = insertValue.toISOString();
                    // const ecranatedValue = insertValue instanceof String ? insertValue.replace("'", "''") : insertValue;

                    this._values.push("'");
                    this._values.push(ecranatedValue);
                    this._values.push("'");
                } else {
                    this._values.push(insertValue);
                }

                if (j < insertValues.length - 1) {
                    this._values.push(", ")
                }
            }
            if (i < values.length - 1) {
                this._values.push("),\n");
            } else {
                this._values.push(")\n");
            }
        }
    }

    appendOnConflict(updates: UpdateExpr){
        return this;
    }

    buildQuery() {
        this._insert.push(this._from.join(''));
        this._insert.push(" (");
        this._insert.push(this._columns.join(''));
        this._insert.push(") ");
        this._insert.push("VALUES\n");
        this._insert.push(this._values.join(''));
        this._insert.push("\n");
        this._insert.push("\n");
        this._insert.push("RETURNING");
        this._insert.push("\n");
        this._insert.push(this._fields.join(''));
        //@TODO onConflict. Research better ways to handle several primary or unique fields
        // this._insert.push("ON CONFLICT ON CONSTRAINT \"");
        // this._insert.push(this._table.tableName());
        // this._insert.push("_");
        // this._insert.push(this._table);
        // this._insert.push("\n");
        // this._insert.push(this._fields.join(''));

        return this._insert.join('');
    }
}