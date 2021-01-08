import type { UserRepository } from '../../../domain/repository/user-repository';
import type { UserDomainEventEmitter } from '../../../event/event-types';
import { UserCommand } from '../../types';
import { UserNotFoundError } from './sign-out-errors';
import { Identifier } from '~lib/domain/identifier';

interface SignOutCommandDependencies {
  domainEventEmitter: UserDomainEventEmitter;
  userRepository: UserRepository;
}

interface SignOutCommandArguments {
  refreshToken: string;
}

export class SignOutCommand extends UserCommand<SignOutCommandArguments> {
  private readonly userRepository: UserRepository;

  public constructor({ domainEventEmitter, userRepository }: SignOutCommandDependencies) {
    super({ domainEventEmitter });
    this.userRepository = userRepository;
  }

  public async execute(args: SignOutCommandArguments) {
    const refreshTokenId = new Identifier(args.refreshToken);
    const user = await this.userRepository.findByRefreshTokenId(refreshTokenId);

    if (!user) {
      throw new UserNotFoundError();
    }

    user.signOut({ refreshTokenId });

    await this.userRepository.store(user);
    this.emitEvents(user);
  }
}
