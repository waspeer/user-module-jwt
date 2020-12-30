import { Identifier } from '~lib/domain/identifier';
import { Event } from '~lib/events/types';

export interface EventRepository {
  findMostRecent(aggregateId: Identifier, eventType: string): Promise<Event | undefined>;
  store(event: Event): Promise<void>;
}
