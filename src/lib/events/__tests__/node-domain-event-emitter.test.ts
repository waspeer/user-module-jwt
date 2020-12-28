import { NodeDomainEventEmitter } from '../node-domain-event-emitter';
import type { Event } from '../types';
import { Identifier } from '~lib/domain/identifier';

const mockLogger = {
  debug: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
};

const mockEventEmitter = {
  on: jest.fn(),
  emit: jest.fn(),
};

jest.mock('events', () => ({
  EventEmitter: jest.fn(() => mockEventEmitter),
}));

const emitter = new NodeDomainEventEmitter({ logger: mockLogger });

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

describe('DomainEventEmitter', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('.emit', () => {
    it('should emit the provided event with EventEmitter', () => {
      const mockEvent = createFakeEvent();

      emitter.emit(mockEvent);

      expect(mockEventEmitter.emit).toHaveBeenCalledWith(mockEvent.type, mockEvent);
    });

    it('should emit multiple event when provided with an array of event', () => {
      const mockEvents = [...Array(3)].map(createFakeEvent);

      emitter.emit(mockEvents);

      expect(mockEventEmitter.emit).toHaveBeenCalledTimes(mockEvents.length);

      mockEvents.forEach((mockEvent) => {
        expect(mockEventEmitter.emit).toHaveBeenCalledWith(mockEvent.type, mockEvent);
      });
    });
  });

  describe('.on', () => {
    it('should subscribe the provided handler to the right event', () => {
      const fakeEvent = createFakeEvent();
      const fakeListener = {
        handle: jest.fn(),
      };

      emitter.on(fakeEvent.type, fakeListener as any);

      expect(mockEventEmitter.on).toHaveBeenCalledWith(fakeEvent.type, expect.any(Function));

      const [, callback] = mockEventEmitter.on.mock.calls[0];
      callback(fakeEvent);

      expect(fakeListener.handle).toHaveBeenCalledWith(fakeEvent);
    });
  });
});
