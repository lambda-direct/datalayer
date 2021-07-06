/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable max-classes-per-file */
type ExtractFieldNames<T> = {
  [Key in keyof T]: T[Key] extends Function ? never : Key;
}[keyof T];

type ExtractModel<TTable> = {
  [Key in ExtractFieldNames<TTable>]: ExtractCodeType<TTable[Key]>
};

abstract class AbstractTable<TTable extends AbstractTable<any>> {
  abstract getTableName(): string;

  insert(value: ExtractModel<TTable>) {

  }

  toDBModel(value: ExtractModel<TTable>): Record<string, unknown> {
    return Object.getOwnPropertyNames(this).reduce<Record<string, unknown>>((res, fieldName) => {
      const field: unknown = (this as unknown as TTable)[fieldName as keyof TTable];
      if (field instanceof Column) {
        res[field.name] = (value as Record<string, unknown>)[fieldName];
      }
      return res;
    }, {});
  }
}

class UsersTable extends AbstractTable<UsersTable> {
  id = new Int('id', true);
  fullName = varchar('full_name');

  foo() {}

  bar() {}

  getTableName(): string {
    return 'users';
  }
}

type ExtractCodeType<T extends Column<any, any, any>> =
    T extends Column<infer TCodeType, any, infer TNullable> ?
      true extends TNullable
        ? TCodeType | null
        : TCodeType
      : never;
type ExtractDBType<T extends Column<any, any>> = T extends Column<any, infer TDBType> ? TDBType : never;

abstract class Column<TCodeType, TDBType = TCodeType, TNullable extends boolean = true> {
  abstract readonly __type: string;

  constructor(public name: string, protected nullable: TNullable) {}

  abstract dbType(): string;

  fromSQL(value: TDBType): TCodeType {
    return value as unknown as TCodeType;
  }

  toSQL(value: TCodeType): TDBType {
    return value as unknown as TDBType;
  }
}

class Int<TNullable extends boolean> extends Column<number, number, TNullable> {
  readonly __type = 'Int';

  dbType(): string {
    return 'int';
  }
}

function int(name: string, params: {nullable: true}): Int<true>;
function int(name: string, params?: {nullable?: false}): Int<false>;
function int(name: string, params: {nullable?: boolean} = {}) {
  return new Int(name, params?.nullable ?? false);
}

class Varchar<TNullable extends boolean> extends Column<string, string, TNullable> {
  dbType(): string {
    return 'varchar';
  }

  readonly __type = 'Varchar';
}

function varchar(name: string, params: {nullable: true}): Varchar<true>;
function varchar(name: string, params?: {nullable?: false}): Varchar<false>;
function varchar(name: string, params: {nullable?: boolean} = {}) {
  return new Varchar(name, params.nullable ?? false);
}

const users = new UsersTable();
type User = ExtractModel<UsersTable>;
type r = ExtractCodeType<Int<false>>;

const user: User = {
  id: 1,
  fullName: 'test',
};

const dbUser = users.toDBModel(user);
console.log(dbUser);
