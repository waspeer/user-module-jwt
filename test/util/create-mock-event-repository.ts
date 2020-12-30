import { EventRepository } from '../../src/domain/repository/event-repository';
import { MockFrom } from './types';

type MockEventRepository = MockFrom<EventRepository>;

export function createMockEventRepository(): MockEventRepository {
  return {
    findMostRecent: jest.fn(),
    store: jest.fn(),
  };
}
