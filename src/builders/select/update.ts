import { Column } from '../../columns/column';
import { ColumnType } from '../../columns/types/columnType'
import { AbstractTable } from '../../tables/abstractTable';
import { UpdateExpr } from '../updates';
import { Expr } from '../where';


export class Update<T extends ColumnType> {
    private _filters: Expr;
    private _table: AbstractTable;
    private _updates: UpdateExpr;

    private constructor(table: AbstractTable) { 
        this._table = table;
    }

    static in(table: AbstractTable){
        return new Update(table);
    }

    filteredBy(filters: Expr): Update<T> {
        this._filters = filters;
        return this;
    }

    set(updates: UpdateExpr): Update<T> {
        this._updates = updates;
        return this;
    }

    build(): string {
        const res = [];

        res.push("UPDATE ");
        res.push(this._table.tableName());

        res.push(`\nSET ${this._updates.toQuery()}`);
        res.push("\nWHERE ");
        res.push(this._filters.toQuery());
        res.push('\nRETURNING\n');
        for (let field of Object.values(this._table)) {
            if (field instanceof Column){
                // TODO Look at where.ts and get VAR class toQuery method. Seems like it's making same steps
                res.push(" ");
                res.push(this._table.tableName());
                res.push(".");
                res.push("\"");
                res.push(field.columnName);
                res.push("\"");
                res.push(" AS ");
                res.push("\"");
                res.push(this._table.tableName().replace(".", "_"));
                res.push("_");
                res.push(field.columnName);
                res.push("\"");
                res.push(",");
            }
        }
        res.pop();

        return res.join('').trimEnd();
    }
}