// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default abstract class ColumnType<TCodeType = {}> {
  public codeType: TCodeType;
  // abstract readonly __type: string;
  protected abstract dbName: string;
  abstract getDbName(): string;
  abstract insertStrategy(value: any): string;
}
