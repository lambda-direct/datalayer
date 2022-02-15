/* eslint-disable import/no-cycle */
import { AbstractTable } from '../../../tables';
import UpdateAggregator from '../../aggregators/updateAggregator';
import UpdateIn from './updateIn';

export default class Update {
  public static in = (table: AbstractTable<any>) => {
    const aggregator = new UpdateAggregator(table);
    aggregator.appendFrom(table.tableName());
    return new UpdateIn(aggregator);
  };
}
