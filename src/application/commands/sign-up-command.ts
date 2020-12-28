import { User } from '../../domain/entity/user';
import { UserRepository } from '../../domain/repository/user-repository';
import { Password } from '../../domain/value-object/password';
import { Username } from '../../domain/value-object/username';
import { UserDomainEventEmitter } from '../../event/event-types';
import { UsernameAlreadyTakenError } from '../errors/username-already-taken-error';
import { Feature } from '~lib/application/feature';

interface SignUpCommandProps {
  domainEventEmitter: UserDomainEventEmitter;
  userRepository: UserRepository;
}

interface SignUpCommandArguments {
  username: string;
  password: string;
}

export class SignUpCommand implements Feature<SignUpCommandArguments, void> {
  private readonly domainEventEmitter: UserDomainEventEmitter;
  private readonly userRepository: UserRepository;

  public constructor({ domainEventEmitter, userRepository }: SignUpCommandProps) {
    this.domainEventEmitter = domainEventEmitter;
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
    this.domainEventEmitter.emit(user.events.all);
  }
}
