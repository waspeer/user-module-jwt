import { UserDTO } from '../../../domain/dto/user-dto';
import { UserRepository } from '../../../domain/repository/user-repository';
import { Username } from '../../../domain/value-object/username';
import { UserMapper } from '../../mapper/user-mapper';
import { UserNotFoundError } from './get-user-by-username-errors';
import { Query } from '~lib/application/types';

interface GetUserByUsernameQueryDependencies {
  userRepository: UserRepository;
}

interface GetUserByUsernameQueryArguments {
  username: string;
}

export class GetUserByUsernameQuery implements Query<GetUserByUsernameQueryArguments, UserDTO> {
  private readonly userRepository: UserRepository;

  public constructor({ userRepository }: GetUserByUsernameQueryDependencies) {
    this.userRepository = userRepository;
  }

  public async execute(args: GetUserByUsernameQueryArguments): Promise<UserDTO> {
    const username = new Username(args.username);
    const user = await this.userRepository.findByUsername(username);

    if (!user) {
      throw new UserNotFoundError();
    }

    return UserMapper.toDTO(user);
  }
}
