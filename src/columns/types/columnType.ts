export abstract class ColumnType {
    abstract dbName: string;
    abstract getDbName(): string;
}