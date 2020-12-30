import { UserRepository } from '../../src/domain/repository/user-repository';
import { MockFrom } from './types';

export function createMockUserRepository(): MockFrom<UserRepository> {
  return {
    findById: jest.fn(),
    findByRefreshTokenId: jest.fn(),
    findByUsername: jest.fn(),
    store: jest.fn(),
  };
}
