import { UserNotFoundError } from '../../src/application/query/get-user-by-username/get-user-by-username-errors';
import { GetUserByUsernameQuery } from '../../src/application/query/get-user-by-username/get-user-by-username-query';
import { createMockUserRepository } from '../util/create-mock-user-repository';
import { createUser } from '../util/create-user';
import { UserDTO } from 'domain/dto/user-dto';

const mockUserRepository = createMockUserRepository();
const query = new GetUserByUsernameQuery({
  userRepository: mockUserRepository,
});

describe('Get User By Username Query', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return the user associated with the provided username', async () => {
    const user = createUser();

    mockUserRepository.findByUsername.mockResolvedValueOnce(user);

    await expect(query.execute({ username: user.username.value })).resolves.toEqual<UserDTO>({
      username: user.username.value,
    });
  });

  it('should throw an error when the user can not be found', async () => {
    mockUserRepository.findByUsername.mockResolvedValueOnce(undefined);

    await expect(query.execute({ username: 'username' })).rejects.toBeInstanceOf(UserNotFoundError);
  });
});
