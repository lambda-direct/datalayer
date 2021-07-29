import { Column } from '../columns';
import ColumnType from '../columns/types/columnType';
import TestEnum from '../examples/testEnum';

export type ExtractFieldNames<TTable> = {
  [Key in keyof TTable]: TTable[Key] extends Function ? never :
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    TTable[Key] extends Column<ColumnType, infer TNullable, infer TAutoIncrement> ?
      true extends TNullable ? never : Key
      : never;
}[keyof TTable];

export type ExtractOptionalFieldNames<TTable> = {
  [Key in keyof TTable]: TTable[Key] extends Function ? never :
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    TTable[Key] extends Column<ColumnType, infer TNullable, infer TAutoIncrement> ?
      true extends TNullable ? Key : never
      : never;
}[keyof TTable];

export type ExtractModel<TTable> =
  {[Key in ExtractFieldNames<TTable>]: ExtractCodeType<TTable[Key]>} &
  {[Key in ExtractOptionalFieldNames<TTable>]?: ExtractCodeType<TTable[Key]>};

export type ExtractCodeType<T extends Column<ColumnType<any>, boolean, boolean>> =
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      T extends Column<ColumnType<infer TCodeType>, infer TNullable, infer TAutoIncrement> ?
        TCodeType
        : never;

export type ExtractEnumValues<TEnum> = {[Key in ExtractFieldNames<TEnum>]: TestEnum[Key]};
