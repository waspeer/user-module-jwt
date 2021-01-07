import type { User } from '../entity/user';
import type { Username } from '../value-object/username';
import type { Identifier } from '~lib/domain/identifier';

export interface UserRepository {
  findByRefreshTokenId(refreshTokenId: Identifier): Promise<User | undefined>;
  findByUsername(username: Username): Promise<User | undefined>;
  store(user: User): Promise<void>;
}
