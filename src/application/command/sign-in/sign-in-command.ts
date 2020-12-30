import { Device } from '../../../domain/entity/device';
import type { UserRepository } from '../../../domain/repository/user-repository';
import { IpAddress } from '../../../domain/value-object/ip-address';
import { UserAgent } from '../../../domain/value-object/user-agent';
import { Username } from '../../../domain/value-object/username';
import type { UserDomainEventEmitter } from '../../../event/event-types';
import { UserCommand } from '../../types';
import { UserNotFoundError } from './sign-in-errors';

interface Dependencies {
  domainEventEmitter: UserDomainEventEmitter;
  userRepository: UserRepository;
}

interface SignInCommandArguments {
  device: {
    ipAddress: string;
    userAgent: string;
  };
  password: string;
  username: string;
}

export class SignInCommand extends UserCommand<SignInCommandArguments> {
  private readonly userRepository: UserRepository;

  public constructor({ domainEventEmitter, userRepository }: Dependencies) {
    super({ domainEventEmitter });
    this.userRepository = userRepository;
  }

  public async execute(args: SignInCommandArguments) {
    const device = new Device({
      ipAddress: new IpAddress(args.device.ipAddress),
      userAgent: new UserAgent(args.device.userAgent),
    });
    const username = new Username(args.username);
    const user = await this.userRepository.findByUsername(username);

    if (!user) {
      throw new UserNotFoundError(username);
    }

    user.signIn({ password: args.password, device });

    await this.userRepository.store(user);
    this.emitEvents(user);
  }
}
