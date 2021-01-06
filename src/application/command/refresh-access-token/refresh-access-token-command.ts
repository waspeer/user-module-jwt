import { UserRepository } from '../../../domain/repository/user-repository';
import { IpAddress } from '../../../domain/value-object/ip-address';
import { UserDomainEventEmitter } from '../../../event/event-types';
import { UserCommand } from '../../types';
import { InvalidRefreshTokenError } from './refresh-access-token-errors';
import { Identifier } from '~lib/domain/identifier';

interface RefreshAccessTokenCommandDependencies {
  domainEventEmitter: UserDomainEventEmitter;
  userRepository: UserRepository;
}

interface RefreshAccessTokenCommandArguments {
  ipAddress: string;
  refreshToken: string;
}

export class RefreshAccessTokenCommand extends UserCommand<RefreshAccessTokenCommandArguments> {
  private readonly userRepository: UserRepository;

  public constructor({
    domainEventEmitter,
    userRepository,
  }: RefreshAccessTokenCommandDependencies) {
    super({ domainEventEmitter });
    this.userRepository = userRepository;
  }

  public async execute(args: RefreshAccessTokenCommandArguments) {
    const ipAddress = new IpAddress(args.ipAddress);
    const refreshTokenId = new Identifier(args.refreshToken);
    const user = await this.userRepository.findByRefreshTokenId(refreshTokenId);

    if (!user) {
      throw new InvalidRefreshTokenError();
    }

    user.refreshAccessToken({ ipAddress, refreshTokenId });

    await this.userRepository.store(user);
    this.emitEvents(user);
  }
}
