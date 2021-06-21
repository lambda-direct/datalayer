import { Pool } from 'pg';
import Column from '../../columns/column';
import ColumnType from '../../columns/types/columnType';
import QueryResponseMapper from '../../mappers/responseMapper';
import Insert from '../lowLvlBuilders/inserts/insert';
import TableRequestBuilder from './abstractRequestBuilder';

export default class InsertTRB<T> extends TableRequestBuilder<T> {
  private _values: T[];

  public constructor(
    tableName: string,
    pool: Pool,
    mappedServiceToDb: { [name in keyof T]: Column<ColumnType, {}>; },
    columns: Column<ColumnType, {}>[],
  ) {
    super(tableName, pool, mappedServiceToDb, columns);
  }

  public returningAll = async () => this.execute();

  protected execute = async (): Promise<T[]> => {
    const queryBuilder = Insert.into(this._tableName);
    if (!this._values) throw Error('Values should be provided firestly\nExample: table.values().execute()');

    const mappedRows: {[name: string]: any}[] = [];
    const mapper = this._mappedServiceToDb;

    this._values.forEach((valueToInsert) => {
      const mappedValue: {[name: string]: any} = {};
      Object.entries(valueToInsert).forEach(([key, value]) => {
        const column = mapper[key as keyof T];
        mappedValue[column.columnName] = value;
      });
      mappedRows.push(mappedValue);
    });

    const query = queryBuilder.values(mappedRows).build();
    console.log(query);
    const result = await this._pool!.query(query);
    return QueryResponseMapper.map(this._mappedServiceToDb, result);
  };
}
