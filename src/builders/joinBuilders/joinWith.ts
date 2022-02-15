/* eslint-disable max-len */
import { AbstractColumn } from '../../columns/column';
import ColumnType from '../../columns/types/columnType';
import { ExtractModel } from '../../tables/inferTypes';
import Join from './join';

export default class JoinWith<TColumn extends ColumnType, TTable> {
  public joinTableName: string;
  public mappedServiceToDb: { [name in keyof ExtractModel<TTable>]: AbstractColumn<TColumn>; };

  public constructor(joinTableName: string,
    mappedServiceToDb: { [name in keyof ExtractModel<TTable>]: AbstractColumn<TColumn>; }) {
    this.joinTableName = joinTableName;
    this.mappedServiceToDb = mappedServiceToDb;
  }

  public columns = <T extends AbstractColumn<ColumnType<any>, boolean, boolean>,
  T1 extends AbstractColumn<ColumnType<any>, boolean, boolean>>(fromColumn: T,
    toColumn: T1): Join<TTable> => new Join(
    this.joinTableName,
    fromColumn, toColumn, this.mappedServiceToDb,
  );
}
