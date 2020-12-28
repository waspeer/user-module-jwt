import { Identifier } from '../../domain/identifier';
import { EventQueue } from '../event-queue';
import type { Event } from '../types';

const queue = new EventQueue();

const createFakeEvent = (): Event => {
  const unique = Date.now().toString();

  const fakeEvent: Event = {
    id: new Identifier(),
    aggregateId: new Identifier(),
    occurredAt: new Date(),
    payload: 'payload',
    type: `${unique}-type`,
    serializePayload: () => 'payload',
  };

  return fakeEvent;
};

describe('EventQueue', () => {
  describe('.add', () => {
    it('should add a new event to the queue', () => {
      const event1 = createFakeEvent();
      const event2 = createFakeEvent();

      queue.add(event1);
      expect(queue.all).toEqual([event1]);

      queue.add(event2);
      expect(queue.all).toEqual(expect.arrayContaining([event1, event2]));
    });
  });
});
