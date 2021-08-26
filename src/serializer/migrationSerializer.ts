/* eslint-disable no-restricted-syntax */
/* eslint-disable new-cap */
/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
import * as fs from 'fs';
import { Column } from '../columns/column';
import ColumnType from '../columns/types/columnType';
import { AbstractTable } from '../tables';

interface ColumnAsObject{
  [name: string]:{
    name?: string
    type?: string
    primaryKey?: boolean
    autoincrement?: boolean
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

export default class MigrationSerializer {
  public generate = async () => {
    const result: TableAsObject = {};
    const filenames = fs.readdirSync('/Users/andrewsherman/IdeaProjects/datalayer/src/examples/tables/');

    filenames.forEach((filename) => {
      const table = this.fromFile(`../examples/tables/${filename.split('.')[0]}`);
      const tableValues = Object.entries(table);

      const columnToReturn: ColumnAsObject = {};
      for (const properties of tableValues) {
        const key = properties[0];
        const value = properties[1];
        if (value instanceof Column) {
          columnToReturn[key] = {
            name: value.columnName,
            type: (value.columnType as ColumnType).getDbName(),
            primaryKey: !!value.primaryKeyName,
            autoincrement: value.isAutoIncrement(),
          };
        }
      }

      result[table.tableName()] = {
        name: table.tableName(),
        columns: columnToReturn,
        indexes: {},
      };
    });

    return result;
  };

  private fromFile(filepath: string): AbstractTable<any> {
    const importedTable = require(filepath);
    return (new importedTable.default() as AbstractTable<any>);
  }
}
