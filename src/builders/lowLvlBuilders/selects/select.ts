import SelectAggregator from '../../aggregators/selectAggregator';
import SelectFrom from './selectFrom';

export default class Select {
  // TODO Add from with tableName as param
  public static from = (tableName: string) => {
    const aggregator = new SelectAggregator(tableName);
    aggregator.appendFrom(tableName);
    return new SelectFrom(aggregator);
  };
}
