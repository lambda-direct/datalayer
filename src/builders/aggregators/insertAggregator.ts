import { Column } from "../../columns/column";
import { ColumnType } from "../../columns/types/columnType";
import { AbstractTable } from "../../tables/abstractTable";
import { shouldEcranate } from "../../utils/ecranate";
import { UpdateExpr } from "../requestBuilders/updates";
import { Aggregator } from "./abstractAggregator";

export class InsertAggregator<SERVICE> extends Aggregator<SERVICE> {
    private _onConflict: Array<string> = [];
    private _columns: Array<string> = [];
    private _values: Array<string> = [];
    private _from: Array<string> = [];
    private _insert: Array<string> = ["INSERT INTO"];

    constructor(table: AbstractTable<SERVICE>){
        super(table);
    }

    appendFrom(table: AbstractTable<SERVICE>): InsertAggregator<SERVICE> {
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
        const mapper = this._table.mapServiceToDb();

        for(let i = 0; i < values.length; i++) {
            const value = values[i];
            const insertValues = Object.values(value);
            const insertKeys = Object.keys(value);

            this._values.push("(");
            for (let j = 0; j < insertValues.length; j++) {
                let insertValue = insertValues[j];
                let insertKey = insertKeys[j];

                const columnKey = Object.keys(mapper).find(it => mapper[it as keyof SERVICE].columnName === insertKey)!
                const column = mapper[columnKey as keyof SERVICE];

                if (insertValue) {
                    this._values.push(column.columnType.insertStrategy(insertValue))
                } else {
                    this._values.push('null')
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