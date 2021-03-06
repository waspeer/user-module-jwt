/* eslint-disable @typescript-eslint/no-non-null-assertion */
import faker from 'faker';
import { SignInCommand } from '../../src/application/command/sign-in/sign-in-command';
import { UserNotFoundError } from '../../src/application/command/sign-in/sign-in-errors';
import { RefreshToken } from '../../src/domain/entity/refresh-token';
import { User } from '../../src/domain/entity/user';
import { UserSignedInEvent } from '../../src/event/user-signed-in-event';
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
    const password = faker.internet.password();
    const user = createUser({ password });
    const username = user.username.value;

    mockUserRepository.findByUsername.mockResolvedValueOnce(user);

    await expect(
      command.execute({
        ipAddress: faker.internet.ip(),
        password,
        userAgent: faker.internet.userAgent(),
        username,
      }),
    ).resolves.toBeUndefined();

    // should store the user with the generated refresh token
    expect(mockUserRepository.store).toHaveBeenCalledWith(expect.any(User));

    const storedUser: User = mockUserRepository.store.mock.calls[0][0];
    const storedRefreshToken = user.refreshTokens[0];

    expect(storedUser.id.equals(user.id)).toBeTrue();
    expect(storedRefreshToken).toBeInstanceOf(RefreshToken);

    // should dispatch the appropriate events
    expect(mockDomainEventEmitter.emit).toHaveBeenCalledWith(
      expect.arrayContaining([expect.any(UserSignedInEvent)]),
    );

    const emittedEvents: any[] = mockDomainEventEmitter.emit.mock.calls[0][0];
    const signInEvent: UserSignedInEvent = emittedEvents.find(
      (event) => event instanceof UserSignedInEvent,
    );

    expect(signInEvent.payload).toEqual<UserSignedInEvent['payload']>({
      accessToken: expect.any(String),
      ipAddress: storedRefreshToken.ipAddress.value,
      refreshToken: storedRefreshToken.value,
    });

    // should store before emitting the event
    expect(mockUserRepository.store).toHaveBeenCalledBefore(mockDomainEventEmitter.emit);
  });

  it('should throw an error when user can not be found', async () => {
    const password = faker.internet.password();
    const username = faker.internet.userName();

    mockUserRepository.findByUsername.mockResolvedValueOnce(undefined);

    await expect(
      command.execute({
        ipAddress: faker.internet.ip(),
        password,
        userAgent: faker.internet.userAgent(),
        username,
      }),
    ).rejects.toBeInstanceOf(UserNotFoundError);
  });
});
