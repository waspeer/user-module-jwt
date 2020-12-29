import faker from 'faker';
import { RefreshToken } from '../../src/domain/entity/refresh-token';
import { User } from '../../src/domain/entity/user';
import { Password } from '../../src/domain/value-object/password';
import { Username } from '../../src/domain/value-object/username';
import { Identifier } from '~lib/domain/identifier';

interface CreateUserProps {
  id?: string;
  password?: string;
  username?: string;
  refreshTokens?: RefreshToken[];
}

export function createUser({
  id = faker.random.uuid(),
  password = faker.internet.password(),
  username = faker.internet.userName(),
  refreshTokens = [],
}: CreateUserProps = {}) {
  return new User(
    {
      password: new Password(password),
      username: new Username(username),
      refreshTokens,
    },
    new Identifier(id),
  );
}
