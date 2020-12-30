import { User } from '../../../domain/entity/user';
import { UserRepository } from '../../../domain/repository/user-repository';
import { Password } from '../../../domain/value-object/password';
import { Username } from '../../../domain/value-object/username';
import { UserDomainEventEmitter } from '../../../event/event-types';
import { UserCommand } from '../../types';
import { UsernameAlreadyTakenError } from './sign-up-errors';

interface Dependencies {
  domainEventEmitter: UserDomainEventEmitter;
  userRepository: UserRepository;
}

interface SignUpCommandArguments {
  username: string;
  password: string;
}

export class SignUpCommand extends UserCommand<SignUpCommandArguments> {
  private readonly userRepository: UserRepository;

  public constructor({ domainEventEmitter, userRepository }: Dependencies) {
    super({ domainEventEmitter });
    this.userRepository = userRepository;
  }

  public async execute(args: SignUpCommandArguments) {
    const username = new Username(args.username);
    const existingUser = await this.userRepository.findByUsername(username);

    if (existingUser) {
      throw new UsernameAlreadyTakenError(username);
    }

    const password = new Password(args.password);
    const user = new User({ username, password });

    await this.userRepository.store(user);
    this.emitEvents(user);
  }
}
