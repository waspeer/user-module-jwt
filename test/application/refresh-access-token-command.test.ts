/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { RefreshAccessTokenCommand } from '../../src/application/command/refresh-access-token/refresh-access-token-command';
import { InvalidRefreshTokenError } from '../../src/application/command/refresh-access-token/refresh-access-token-errors';
import { RefreshToken } from '../../src/domain/entity/refresh-token';
import { UserEventTypes } from '../../src/event/event-types';
import { UserAccessTokenRefreshedEvent } from '../../src/event/user-access-token-refreshed-event';
import { createMockDomainEventEmitter } from '../util/create-mock-domain-event-emitter';
import { createMockUserRepository } from '../util/create-mock-user-repository';
import { createRefreshToken } from '../util/create-refresh-token';
import { createUser } from '../util/create-user';

const mockDomainEventEmitter = createMockDomainEventEmitter();
const mockUserRepository = createMockUserRepository();
const command = new RefreshAccessTokenCommand({
  domainEventEmitter: mockDomainEventEmitter,
  userRepository: mockUserRepository,
});

describe('Refresh Access Token Command', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should create a new access token, extend the refresh token and dispatch appropriate events', async () => {
    const initialRefreshTokenExpireDate = new Date(Date.now() + RefreshToken.LIFETIME / 2);
    const refreshToken = createRefreshToken({ expiresAt: initialRefreshTokenExpireDate });
    const user = createUser({ refreshTokens: [refreshToken] });

    mockUserRepository.findByRefreshTokenId.mockResolvedValueOnce(user);

    await expect(
      command.execute({
        ipAddress: refreshToken.ipAddress.value,
        refreshToken: refreshToken.value,
      }),
    ).resolves.toBeUndefined();

    // should store the user and the extended refresh token
    expect(mockUserRepository.store).toHaveBeenCalledWith(user);
    expect(refreshToken.expiresAt).toBeAfter(initialRefreshTokenExpireDate);

    // should emit the appropriate events
    expect(mockDomainEventEmitter.emit).toHaveBeenCalledWith(
      expect.arrayContaining([expect.any(UserAccessTokenRefreshedEvent)]),
    );

    const refreshEvent = command.findEmittedEvent<UserAccessTokenRefreshedEvent>(
      UserEventTypes.AccessTokenRefreshed,
    )!;

    expect(refreshEvent.payload.accessToken).toBeString();
    expect(refreshEvent.payload.ipAddress).toBe(refreshToken.ipAddress.value);
    expect(refreshEvent.payload.refreshToken).toBe(refreshToken.value);

    // should store before emitting the event
    expect(mockUserRepository.store).toHaveBeenCalledBefore(mockDomainEventEmitter.emit);
  });

  it('should throw an error when the user cannot be found', async () => {
    const refreshToken = createRefreshToken();

    await expect(
      command.execute({
        ipAddress: refreshToken.ipAddress.value,
        refreshToken: refreshToken.value,
      }),
    ).rejects.toBeInstanceOf(InvalidRefreshTokenError);
  });
});
