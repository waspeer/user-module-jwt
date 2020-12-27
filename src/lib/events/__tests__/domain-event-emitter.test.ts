import { DomainEventEmitter } from '../domain-event-emitter';
import { Event } from '../event';

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

const emitter = new DomainEventEmitter({ logger: mockLogger });

const createFakeEvent = (): Event => {
  const unique = Date.now().toString();

  return {
    type: `${unique}-type`,
    aggregateId: `${unique}-id`,
    createdAt: new Date(),
    payload: {},
  };
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
