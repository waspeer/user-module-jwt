/* eslint-disable max-classes-per-file */
import { Listener } from '../listener';
import { Event } from '../types';
import { Identifier } from '~lib/domain/identifier';

const mockDomainEventEmitter = {
  emit: jest.fn(),
  on: jest.fn(),
};

const fakeEvent: Event = {
  id: new Identifier('id'),
  aggregateId: new Identifier('id'),
  occurredAt: new Date(),
  payload: 'payload',
  type: 'fake.event',
  serializePayload: () => 'payload',
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
