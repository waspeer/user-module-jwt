import { UserRepository } from '../../../domain/repository/user-repository';
import { Username } from '../../../domain/value-object/username';
import { UserNotFoundError } from './get-user-by-username-errors';
import { Query } from '~lib/application/types';
import { User } from '../../../domain/entity/user';

interface GetUserByUsernameQueryDependencies {
  userRepository: UserRepository;
}

interface GetUserByUsernameQueryArguments {
  username: string;
}

export class GetUserByUsernameQuery implements Query<GetUserByUsernameQueryArguments, User> {
  private readonly userRepository: UserRepository;

  public constructor({ userRepository }: GetUserByUsernameQueryDependencies) {
    this.userRepository = userRepository;
  }

  public async execute(args: GetUserByUsernameQueryArguments): Promise<User> {
    const username = new Username(args.username);
    const user = await this.userRepository.findByUsername(username);

    if (!user) {
      throw new UserNotFoundError();
    }

    return user;
  }
}
