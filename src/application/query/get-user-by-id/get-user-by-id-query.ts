import { UserDTO } from '../../../domain/dto/user-dto';
import { UserRepository } from '../../../domain/repository/user-repository';
import { UserMapper } from '../../mapper/user-mapper';
import { UserNotFoundError } from './get-user-by-id-errors';
import { Feature } from '~lib/application/types';
import { Identifier } from '~lib/domain/identifier';

interface GetUserByIdQueryDependencies {
  userRepository: UserRepository;
}

interface GetUserByIdQueryArguments {
  userId: string;
}

export class GetUserByIdQuery implements Feature<GetUserByIdQueryArguments, UserDTO> {
  private readonly userRepository: UserRepository;

  public constructor({ userRepository }: GetUserByIdQueryDependencies) {
    this.userRepository = userRepository;
  }

  public async execute(args: GetUserByIdQueryArguments): Promise<UserDTO> {
    const userId = new Identifier(args.userId);
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    return UserMapper.toDTO(user);
  }
}
