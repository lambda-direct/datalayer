import AbstractTable from '../../../tables/abstractTable';
import UpdateAggregator from '../../aggregators/updateAggregator';
import UpdateIn from './updateIn';

export default class Update {
  public static in = <SERVICE>(table: AbstractTable<SERVICE>) => {
    const aggregator = new UpdateAggregator(table);
    aggregator.appendFrom(table).appendFields();
    return new UpdateIn(aggregator);
  };
}
