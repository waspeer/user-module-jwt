import { UUID } from '../../domain/uuid';
import type { Event } from '../event';
import { EventQueue } from '../event-queue';

const queue = new EventQueue();

class TestEvent implements Event<'test.event', boolean> {
  public readonly aggregateId: string;
  public readonly createdAt: Date;
  public readonly payload: boolean;
  public readonly type = 'test.event';

  constructor() {
    this.aggregateId = new UUID().value;
    this.createdAt = new Date();
    this.payload = true;
  }
}

describe('EventQueue', () => {
  describe('.add', () => {
    it('should add a new event to the queue', () => {
      const event1 = new TestEvent();
      const event2 = new TestEvent();

      queue.add(event1);
      expect(queue.all).toEqual([event1]);

      queue.add(event2);
      expect(queue.all).toEqual(expect.arrayContaining([event1, event2]));
    });
  });
});
