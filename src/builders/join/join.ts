import { Column } from "../../columns/column";
import { ColumnType } from "../../columns/types/columnType";
import { AbstractTable } from "../../tables/abstractTable";

export class Join<T extends ColumnType, K> {
    fromColumn: Column<T>;
    toColumn: Column<T>;
    joinTable: AbstractTable<K>;
    type: JoinStrategy;

    constructor(joinTable: AbstractTable<K>, toColumn: Column<T>, fromColumn: Column<T>) {
        this.joinTable = joinTable;
        this.toColumn = toColumn;
        this.fromColumn = fromColumn;
    }

    static with<K, M extends AbstractTable<K>>(table: M): JoinWith<K> {
        return new JoinWith(table);
    }

    joinStrategy(type: JoinStrategy):Join<T, K> {
        this.type = type;
        return this;
    }

    columns(fromColumn:Column<T> , toColumn:Column<T> ): Join<T, K>  {
        this.toColumn = toColumn;
        this.fromColumn = fromColumn;
        return this;
    }
}

class JoinWith<K> {
    joinTable: AbstractTable<K>;

    constructor(joinTable: AbstractTable<K>) {
        this.joinTable = joinTable;
    }

    columns<T extends ColumnType>(fromColumn:Column<T> , toColumn:Column<T> ): Join<T, K>  {
        return new Join(this.joinTable, fromColumn, toColumn);
    }
}

export enum JoinStrategy {
    INNER_JOIN = 'INNER JOIN',
    LEFT_JOIN = 'LEFT JOIN',
    RIGHT_JOIN = 'RIGHT JOIN',
}
