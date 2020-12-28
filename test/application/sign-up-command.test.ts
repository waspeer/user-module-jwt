import { SignUpCommand } from '../../src/application/commands/sign-up-command';
import { User } from '../../src/domain/entity/user';
import { UserCreatedEvent } from '../../src/event/user-created-event';
import { createMockDomainEventEmitter } from '../util/create-mock-domain-event-emitter';
import { createMockUserRepository } from '../util/create-mock-user-repository';
import { Event } from '~lib/events/types';

const mockDomainEventEmitter = createMockDomainEventEmitter();
const mockUserRepository = createMockUserRepository();
const command = new SignUpCommand({
  domainEventEmitter: mockDomainEventEmitter,
  userRepository: mockUserRepository,
});

describe('Sign Up Command', () => {
  it('should store a new user entity and dispatch a created event', async () => {
    const username = 'username';
    const password = 'password';

    await expect(command.execute({ username, password })).resolves.toBeUndefined();

    // should be stored
    expect(mockUserRepository.store).toHaveBeenCalledWith(expect.any(User));

    const storedUser: User = mockUserRepository.store.mock.calls[0][0];
    expect(storedUser.username.equals(username)).toBe(true);
    expect(storedUser.password.equals(password)).toBe(true);

    // should dispatch created event
    expect(mockDomainEventEmitter.emit).toHaveBeenCalledWith(
      expect.arrayContaining([expect.any(UserCreatedEvent)]),
    );

    const emittedEvent: UserCreatedEvent = mockDomainEventEmitter.emit.mock.calls[0][0].find(
      (event: Event) => event instanceof UserCreatedEvent,
    );
    expect(emittedEvent.aggregateId.equals(storedUser.id)).toBe(true);
    expect(emittedEvent.payload.user.id.equals(storedUser.id)).toBe(true);

    // should store before emitting the event
    expect(mockUserRepository.store).toHaveBeenCalledBefore(mockDomainEventEmitter.emit);
  });

  // TODO should throw an error when username is already taken
});
