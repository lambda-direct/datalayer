import AbstractTable from '../../../tables/abstractTable';
import DeleteAggregator from '../../aggregators/deleteAggregator';
import DeleteFrom from './deleteFrom';

export default class Delete<SERVICE> {
  public static from = <SERVICE>(table: AbstractTable<SERVICE>): DeleteFrom<SERVICE> => {
    const aggregator = new DeleteAggregator(table);
    aggregator.appendFrom(table).appendFields();
    return new DeleteFrom(aggregator);
  };
}
