import { UserNotFoundError } from '../../src/application/query/get-user-by-id/get-user-by-id-errors';
import { GetUserByIdQuery } from '../../src/application/query/get-user-by-id/get-user-by-id-query';
import { UserDTO } from '../../src/domain/dto/user-dto';
import { createMockUserRepository } from '../util/create-mock-user-repository';
import { createUser } from '../util/create-user';

const mockUserRepository = createMockUserRepository();
const query = new GetUserByIdQuery({
  userRepository: mockUserRepository,
});

describe('Get User By ID Query', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return the user associated with the provided identifier', async () => {
    const user = createUser();

    mockUserRepository.findById.mockResolvedValueOnce(user);

    await expect(query.execute({ userId: user.id.value })).resolves.toEqual<UserDTO>({
      username: user.username.value,
    });
  });

  it('should throw an error when the user can not be found', async () => {
    mockUserRepository.findById.mockResolvedValueOnce(undefined);

    await expect(query.execute({ userId: 'userId' })).rejects.toBeInstanceOf(UserNotFoundError);
  });
});
