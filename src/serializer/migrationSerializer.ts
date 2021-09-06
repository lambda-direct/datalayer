/* eslint-disable no-restricted-syntax */
/* eslint-disable new-cap */
/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
import * as fs from 'fs';
import { Pool } from 'pg';
import { Column } from '../columns/column';
import ColumnType from '../columns/types/columnType';
import PgEnum from '../columns/types/pgEnum';
import { DB } from '../db';
import TableIndex from '../indexes/tableIndex';
import { AbstractTable } from '../tables';

interface ColumnAsObject{
  [name: string]:{
    name?: string
    type?: string
    primaryKey?: boolean
    autoincrement?: boolean
    unique?: boolean
  }
}

interface IndexColumnAsObject{
  [name: string]: {
    name?: string
  }
}

interface IndexAsObject{
  [name: string]:{
    name?: string
    columns?: ColumnAsObject
  }
}

interface TableAsObject {
  [name: string]: {
    name: string,
    columns: ColumnAsObject,
    indexes: {
      [name: string]:{
        name?: string
        type?: string
      }
    }
  }
}

interface EnumAsObject {
  [name: string]: {
    name: string,
    values: string[]
  }
}

export default class MigrationSerializer {
  public generate = () => {
    const result: TableAsObject = {};
    const filenames = fs.readdirSync('/Users/andrewsherman/IdeaProjects/datalayer/src/examples/tables/');

    const enumToReturn: EnumAsObject = {};

    filenames.forEach((filename) => {
      const table = this.fromFile(`../examples/tables/${filename.split('.')[0]}`);
      const tableValues = Object.entries(table);

      const columnToReturn: ColumnAsObject = {};
      const indexToReturn: IndexAsObject = {};

      for (const properties of tableValues) {
        const key = properties[0];
        const value = properties[1];
        if (value instanceof TableIndex) {
          const columns = value.getColumns();
          const name = value.indexName();

          const indexColumnToReturn: IndexColumnAsObject = {};

          for (const column of columns) {
            const columnName = column.getColumnName();
            indexColumnToReturn[columnName] = {
              name: columnName,
            };
          }

          indexToReturn[name] = {
            name,
            columns: indexColumnToReturn,
          };
        }
        if (value instanceof Column) {
          const columnType = value.getColumnType();
          if (columnType instanceof PgEnum) {
            const enumValues = Object.values(columnType.codeType) as string[];
            enumToReturn[columnType.getDbName()] = {
              name: columnType.getDbName(),
              values: enumValues,
            };
          }
          columnToReturn[key] = {
            name: value.getColumnName(),
            type: (value.getColumnType() as ColumnType).getDbName(),
            primaryKey: !!value.primaryKeyName,
            autoincrement: value.isAutoIncrement(),
            unique: !!value.uniqueKeyName,
          };
        }
      }

      result[table.tableName()] = {
        name: table.tableName(),
        columns: columnToReturn,
        indexes: indexToReturn,
      };
    });

    return { version: '1', tables: result, enums: enumToReturn };
  };

  private fromFile(filepath: string): AbstractTable<any> {
    const db = new DB(new Pool());
    const importedTable = require(filepath);
    return (new importedTable.default(db) as AbstractTable<any>);
  }
}
