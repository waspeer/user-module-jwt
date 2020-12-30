import type { User } from '../../src/domain/entity/user';
import { AccessToken } from '../../src/domain/value-object/access-token';
import { createUser } from './create-user';

interface CreateAccessTokenProps {
  user?: User;
}

export function createAccessToken({ user = createUser() }: CreateAccessTokenProps = {}) {
  return new AccessToken({ user });
}
