import { MockFrom } from './types';
import { DomainEventEmitter } from '~lib/events/types';

type MockDomainEventEmitter = MockFrom<DomainEventEmitter<any>>;

export function createMockDomainEventEmitter(): MockDomainEventEmitter {
  return {
    emit: jest.fn(),
    on: jest.fn(),
  };
}
