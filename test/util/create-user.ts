import { User } from '../../src/domain/entity/user';
import { Password } from '../../src/domain/value-object/password';
import { Username } from '../../src/domain/value-object/username';

interface CreateUserProps {
  password?: string;
  username?: string;
}

export function createUser({ password = 'password', username = 'username' }: CreateUserProps = {}) {
  return new User({
    password: new Password(password),
    username: new Username(username),
  });
}
