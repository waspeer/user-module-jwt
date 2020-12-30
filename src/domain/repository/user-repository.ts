import { User } from 'domain/entity/user';
import { Username } from 'domain/value-object/username';
import { Identifier } from '~lib/domain/identifier';

export interface UserRepository {
  findByRefreshTokenId(refreshTokenId: Identifier): Promise<User | undefined>;
  findByUsername(username: Username): Promise<User | undefined>;
  store(user: User): Promise<void>;
}
