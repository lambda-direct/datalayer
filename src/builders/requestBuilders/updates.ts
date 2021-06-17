import { Column } from "../../columns/column";
import { ColumnType } from "../../columns/types/columnType";

export class Updates {
    static set<T extends ColumnType>(column: Column<T>, value: any): UpdateExpr{
        return new SetObject(column.columnName, value)
    }

    static combine(updates: Array<UpdateExpr>): UpdateExpr {
        return new Combine(updates)
    }
}

export abstract class UpdateExpr {
    abstract toQuery(): string;
}

class SetObject extends UpdateExpr{
    private _column: String;
    private _value: any;

    constructor(column: String, value: any){
        super();
        this._column = column;
        this._value = value;
    }

    toQuery(): string {
        if (typeof this._value === 'string' || this._value instanceof Date) {
            this._value = typeof this._value === 'string' ? this._value.replace("'", "''"): this._value
            if (this._value instanceof Date) this._value = this._value.toISOString();
            return `\"${this._column}\"='${this._value.toString()}'`
        } else {
            return `\"${this._column}\"=${this._value.toString()}`
        }
    }
}

class Combine extends UpdateExpr{
    private _setters: Array<UpdateExpr>;

    constructor(setters: Array<UpdateExpr>){
        super();
        this._setters = setters;
    }

    toQuery(): string {
        const response = [];

        for (let index = 0; index < this._setters.length; index++) {
            const setter = this._setters[index];
            response.push(setter.toQuery());

            if(index === this._setters.length - 1) continue;
            response.push(", ")
        }

        return response.join("");
    }
}