import type { Event } from '../event';
import { Listener } from '../listener';

const mockDomainEventEmitter = {
  emit: jest.fn(),
  on: jest.fn(),
};

const fakeEvent: Event = {
  aggregateId: 'id',
  createdAt: new Date(),
  payload: 'payload',
  type: 'fake.event',
};

class FakeListener extends Listener<typeof fakeEvent> {
  public readonly eventType = fakeEvent.type;

  // eslint-disable-next-line class-methods-use-this
  public async handle() {
    //
  }
}

describe('Listener', () => {
  describe('.register', () => {
    it('should subscribe to the right event', () => {
      const fakeListener = new FakeListener({ domainEventEmitter: mockDomainEventEmitter as any });

      fakeListener.register();

      expect(mockDomainEventEmitter.on).toHaveBeenCalledWith(fakeEvent.type, fakeListener);
    });
  });
});
