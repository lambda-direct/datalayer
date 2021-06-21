import InsertAggregator from '../../aggregators/insertAggregator';
import InsertInto from './insertInto';

export default class Insert {
  public static into = (tableName: string) => {
    const aggregator = new InsertAggregator(tableName);
    aggregator.appendFrom(tableName);
    return new InsertInto(aggregator);
  };
}
