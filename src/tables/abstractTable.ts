export abstract class AbstractTable {
    protected varchar(params: string, size: number) {
        
    }

    abstract tableName(): string;
}