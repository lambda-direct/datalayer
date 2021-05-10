import { Column } from "../columns/column";
import { ColumnType } from "../columns/types/columnType";

export class Where {
    static eq<T extends ColumnType>(left: Column<T>, value: any): Expr{
        return new EqWhere(new Var<T>(left), new Const(value));
    }
}

export abstract class Expr {
    abstract toQuery(): string;
}

class EqWhere extends Expr {
    private left: Expr;
    private right: Expr;

    constructor(left: Expr, right: Expr){
        super();
        this.left = left;
        this.right = right;
    }

    toQuery(): string {
        return `${this.left.toQuery()}=${this.right.toQuery()}`
    }
}

class Var<T extends ColumnType> extends Expr {
    private column: Column<T>

    constructor(column: Column<T>){
        super();
        this.column = column;
    }

    toQuery(): string {
        return `${this.column.getParent().tableName()}.\"${this.column.columnName}\"`;
    }
}

class Const extends Expr {
    private value: any;

    constructor(value: any){
        super();
        this.value = value;
    }

    toQuery(): string {
        if (typeof this.value === 'string' || this.value instanceof Date) {
            return `'${this.value.toString()}'`
        } else {
            return this.value.toString();
        }
    }
}