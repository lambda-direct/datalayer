import AbstractTable from '../../../tables/abstractTable';
import InsertAggregator from '../../aggregators/insertAggregator';
import InsertInto from './insertInto';

export default class Insert {
  public static into = <SERVICE>(table: AbstractTable<SERVICE>) => {
    const aggregator = new InsertAggregator(table);
    aggregator.appendFrom(table).appendFields();
    return new InsertInto(aggregator);
  };
}
