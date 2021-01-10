import { SignUpCommand } from '../../src/application/command/sign-up/sign-up-command';
import { UsernameAlreadyTakenError } from '../../src/application/command/sign-up/sign-up-errors';
import { User } from '../../src/domain/entity/user';
import { UserCreatedEvent } from '../../src/event/user-created-event';
import { createMockDomainEventEmitter } from '../util/create-mock-domain-event-emitter';
import { createMockUserRepository } from '../util/create-mock-user-repository';
import { createUser } from '../util/create-user';
import { Event } from '~lib/events/types';

const mockDomainEventEmitter = createMockDomainEventEmitter();
const mockUserRepository = createMockUserRepository();
const command = new SignUpCommand({
  domainEventEmitter: mockDomainEventEmitter,
  userRepository: mockUserRepository,
});

describe('Sign Up Command', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should store a new user entity and dispatch a created event', async () => {
    const username = 'username';
    const password = 'password';

    mockUserRepository.findByUsername.mockResolvedValueOnce(undefined);
    await expect(command.execute({ username, password })).resolves.toBeUndefined();

    // should be stored
    expect(mockUserRepository.store).toHaveBeenCalledWith(expect.any(User));

    const storedUser: User = mockUserRepository.store.mock.calls[0][0];
    expect(storedUser.username.value).toBe(username);
    expect(storedUser.password.equals(password)).toBe(true);

    // should dispatch created event
    expect(mockDomainEventEmitter.emit).toHaveBeenCalledWith(
      expect.arrayContaining([expect.any(UserCreatedEvent)]),
    );

    const emittedEvent: UserCreatedEvent = mockDomainEventEmitter.emit.mock.calls[0][0].find(
      (event: Event) => event instanceof UserCreatedEvent,
    );
    expect(emittedEvent.aggregateId.equals(storedUser.id)).toBe(true);
    expect(emittedEvent.payload.userId).toBe(storedUser.id.value);

    // should store before emitting the event
    expect(mockUserRepository.store).toHaveBeenCalledBefore(mockDomainEventEmitter.emit);
  });

  it('should throw an error when username is already taken', async () => {
    const user = createUser();
    const username = user.username.value;
    const password = user.password.value;

    mockUserRepository.findByUsername.mockResolvedValueOnce(user);
    await expect(command.execute({ username, password })).rejects.toBeInstanceOf(
      UsernameAlreadyTakenError,
    );
  });
});
