/* eslint-disable @typescript-eslint/no-non-null-assertion */
import faker from 'faker';
import { SignInCommand } from '../../src/application/command/sign-in/sign-in-command';
import { UserNotFoundError } from '../../src/application/command/sign-in/sign-in-errors';
import { RefreshToken } from '../../src/domain/entity/refresh-token';
import { User } from '../../src/domain/entity/user';
import { AccessToken } from '../../src/domain/value-object/access-token';
import { UserAccessTokenCreatedEvent } from '../../src/event/user-access-token-created-event';
import { UserRefreshTokenCreatedEvent } from '../../src/event/user-refresh-token-created-event';
import { createDevice } from '../util/create-device';
import { createMockDomainEventEmitter } from '../util/create-mock-domain-event-emitter';
import { createMockUserRepository } from '../util/create-mock-user-repository';
import { createUser } from '../util/create-user';

const mockDomainEventEmitter = createMockDomainEventEmitter();
const mockUserRepository = createMockUserRepository();
const command = new SignInCommand({
  domainEventEmitter: mockDomainEventEmitter,
  userRepository: mockUserRepository,
});

describe('Sign In Command', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should create new tokens when a refresh token does not exist and dispatch the appropriate events', async () => {
    const device = createDevice();
    const ipAddress = device.ipAddress.value;
    const userAgent = device.userAgent.value;

    const password = faker.internet.password();
    const user = createUser({ password });
    const username = user.username.value;

    mockUserRepository.findByUsername.mockResolvedValueOnce(user);

    await expect(
      command.execute({
        device: { ipAddress, userAgent },
        password,
        username,
      }),
    ).resolves.toBeUndefined();

    // should store the user with the generated refresh token
    expect(mockUserRepository.store).toHaveBeenCalledWith(expect.any(User));

    const storedUser: User = mockUserRepository.store.mock.calls[0][0];
    const storedRefreshToken = storedUser.findRefreshTokenForDevice(device)!;

    expect(storedUser.id.equals(user.id)).toBeTrue();
    expect(storedRefreshToken).toBeInstanceOf(RefreshToken);

    // should dispatch UserRefreshTokenCreatedEvent and UserAccessTokenCreatedEvent
    expect(mockDomainEventEmitter.emit).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.any(UserRefreshTokenCreatedEvent),
        expect.any(UserAccessTokenCreatedEvent),
      ]),
    );

    const emittedEvents: any[] = mockDomainEventEmitter.emit.mock.calls[0][0];
    const refreshTokenEvent: UserRefreshTokenCreatedEvent = emittedEvents.find(
      (event) => event instanceof UserRefreshTokenCreatedEvent,
    );
    const accessTokenEvent: UserAccessTokenCreatedEvent = emittedEvents.find(
      (event) => event instanceof UserAccessTokenCreatedEvent,
    );

    expect(refreshTokenEvent.payload.refreshToken).toBe(storedRefreshToken);
    expect(accessTokenEvent.payload.accessToken).toBeInstanceOf(AccessToken);
  });

  it('should throw an error when user can not be found', async () => {
    const device = createDevice();
    const ipAddress = device.ipAddress.value;
    const userAgent = device.userAgent.value;

    const password = faker.internet.password();
    const username = faker.internet.userName();

    mockUserRepository.findByUsername.mockResolvedValueOnce(undefined);

    await expect(
      command.execute({
        device: { ipAddress, userAgent },
        password,
        username,
      }),
    ).rejects.toBeInstanceOf(UserNotFoundError);
  });
});
