import { SignOutCommand } from '../../src/application/command/sign-out/sign-out-command';
import { UserNotFoundError } from '../../src/application/command/sign-out/sign-out-errors';
import { UserSignedOutEvent } from '../../src/event/user-signed-out-event';
import { createMockDomainEventEmitter } from '../util/create-mock-domain-event-emitter';
import { createMockUserRepository } from '../util/create-mock-user-repository';
import { createRefreshToken } from '../util/create-refresh-token';
import { createUser } from '../util/create-user';

const mockDomainEventEmitter = createMockDomainEventEmitter();
const mockUserRepository = createMockUserRepository();
const command = new SignOutCommand({
  domainEventEmitter: mockDomainEventEmitter,
  userRepository: mockUserRepository,
});

describe('Sign Out Command', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should remove the appropriate refresh token and dispatch the appropriate events', async () => {
    const refreshTokenToInvalidate = createRefreshToken();
    const user = createUser({ refreshTokens: [refreshTokenToInvalidate] });

    mockUserRepository.findByRefreshTokenId.mockResolvedValueOnce(user);

    expect(user.refreshTokens).toContain(refreshTokenToInvalidate);

    await expect(
      command.execute({
        refreshToken: refreshTokenToInvalidate.value,
      }),
    ).resolves.toBeUndefined();

    // should remove the appropriate refresh token
    expect(mockUserRepository.store).toHaveBeenCalledWith(user);
    expect(user.refreshTokens).not.toContain(refreshTokenToInvalidate);

    // should dispatch the appropriate events
    expect(mockDomainEventEmitter.emit).toHaveBeenCalledWith(
      expect.arrayContaining([expect.any(UserSignedOutEvent)]),
    );

    // should store before emitting the event
    expect(mockUserRepository.store).toHaveBeenCalledBefore(mockDomainEventEmitter.emit);
  });

  it('should throw an error if a user can not be found', async () => {
    const refreshTokenToInvalidate = createRefreshToken();

    mockUserRepository.findByRefreshTokenId.mockResolvedValueOnce(undefined);

    await expect(
      command.execute({
        refreshToken: refreshTokenToInvalidate.value,
      }),
    ).rejects.toBeInstanceOf(UserNotFoundError);
  });
});
