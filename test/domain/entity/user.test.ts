import { User } from '../../../src/domain/entity/user';

(() => User)();

describe('User', () => {
  test('smoke', () => {
    expect(1).toBe(1);
  });
  // TODO
});
