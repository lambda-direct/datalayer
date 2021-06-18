export abstract class ColumnType {
    protected abstract dbName: string;
    abstract getDbName(): string;
    abstract insertStrategy(value: any): string;
}