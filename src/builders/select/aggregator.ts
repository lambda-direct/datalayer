import { Column } from "../../columns/column";
import { AbstractTable } from "../../tables/abstractTable";
import { ecranate, shouldEcranate } from "../../utils/ecranate";
import { UpdateExpr } from "../updates";
import { Expr } from "../where";

class Aggregator {
    protected _fields: Array<string> = [];
    protected _table: AbstractTable;

    constructor(table: AbstractTable){
        this._table = table;
    }

    appendFields() {
        for (let field of Object.values(this._table)) {
            if (field instanceof Column){
                this._fields.push(" ");
                this._fields.push(this._table.tableName());
                this._fields.push(".");
                this._fields.push(ecranate(field.columnName));
                this._fields.push(" AS ");
                this._fields.push(ecranate(`${this._table.tableName().replace(".", "_")}_${field.columnName}`))
                this._fields.push(",");
            }
        }
        this._fields.pop()
    }
}

export class SelectAggregator extends Aggregator {
    private _from: Array<string> = [];
    private _filters: Array<string> = [];
    private _select: Array<string> = ["SELECT"];

    constructor(table: AbstractTable){
        super(table);
    }

    filters(filters: Expr): SelectAggregator {
        this._filters.push("WHERE ");
        this._filters.push(filters.toQuery());
        return this;
    }

    appendFrom(table: AbstractTable): SelectAggregator {
        this._from.push(" FROM ");
        this._from.push(table.tableName());
        return this
    }

    buildQuery() {
        this._select.push(this._fields.join(''));
        this._select.push("\n");
        this._select.push(this._from.join(''));
        this._select.push("\n");
        this._select.push(this._filters.join(''));

        return this._select.join('');
    }
}

export class UpdateAggregator extends Aggregator {
    private _updates: Array<string> = [];
    private _filters: Array<string> = [];
    private _from: Array<string> = [];
    private _update: Array<string> = ["UPDATE"];

    constructor(table: AbstractTable){
        super(table);
    }

    where(filters: Expr): UpdateAggregator {
        this._filters.push("WHERE ");
        this._filters.push(filters.toQuery());
        return this;
    }

    appendFrom(table: AbstractTable): UpdateAggregator {
        this._from.push(" ");
        this._from.push(table.tableName());
        return this;
    }

    set(updates: UpdateExpr): UpdateAggregator {
        this._updates.push(`\nSET ${updates.toQuery()}`);
        return this;
    }

    buildQuery() {
        this._update.push(this._from.join(''));
        this._update.push("\n");
        this._update.push(this._updates.join(''));
        this._update.push("\n");
        this._update.push(this._filters.join(''));
        this._update.push("\n");
        this._update.push("RETURNING");
        this._update.push("\n");
        this._update.push(this._fields.join(''));

        return this._update.join('');
    }
}

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
                if (shouldEcranate(value)) {
                    const ecranatedValue =  insertValue instanceof String ? insertValue.replace("'", "''") :  insertValue;

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