import { Column } from "../../columns/column";
import { ColumnType } from "../../columns/types/columnType";
import { AbstractTable } from "../../tables/abstractTable";

export class Join<T extends ColumnType, K, DB> {
    fromColumn: Column<T>;
    toColumn: Column<T>;
    joinTable: AbstractTable<K, DB>;
    type: JoinStrategy;

    constructor(joinTable: AbstractTable<K, DB>, fromColumn: Column<T>, toColumn: Column<T>,) {
        this.joinTable = joinTable;
        this.toColumn = toColumn;
        this.fromColumn = fromColumn;
    }

    static with<T extends ColumnType,K, DB>(table: AbstractTable<K, DB>): JoinWith<T, K> {
        return new JoinWith(table);
    }

    joinStrategy(type: JoinStrategy): Join<T, K, DB> {
        this.type = type;
        return this;
    }

    columns(fromColumn:Column<T> , toColumn:Column<T> ): Join<T, K, DB>  {
        this.toColumn = toColumn;
        this.fromColumn = fromColumn;
        return this;
    }
}

export class JoinWith<T extends ColumnType, K> {
    joinTable: AbstractTable<K, {}>;

    constructor(joinTable: AbstractTable<K, {}>) {
        this.joinTable = joinTable;
    }

    columns(fromColumn:Column<T> , toColumn:Column<T>): Join<T, K, {}>  {
        return new Join(this.joinTable, fromColumn, toColumn);
    }
}

export enum JoinStrategy {
    INNER_JOIN = 'INNER JOIN',
    LEFT_JOIN = 'LEFT JOIN',
    RIGHT_JOIN = 'RIGHT JOIN',
}
