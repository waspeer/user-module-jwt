/* eslint-disable class-methods-use-this */
import { User } from 'domain/entity/user';
import { UserRepository } from 'domain/repository/user-repository';
import { Username } from 'domain/value-object/username';
import { Identifier } from '~lib/domain/identifier';

const storage = new Map<string, User>();
const usernameToUserIdMap = new Map<string, string>();
const refreshTokenToUserIdMap = new Map<string, string>();

export class InMemoryUserRepository implements UserRepository {
  public async findById(userId: Identifier) {
    return storage.get(userId.value);
  }

  public async findByRefreshTokenId(refreshTokenId: Identifier) {
    const userId = refreshTokenToUserIdMap.get(refreshTokenId.value);
    if (!userId) return undefined;
    return storage.get(userId);
  }

  public async findByUsername(username: Username) {
    const userId = usernameToUserIdMap.get(username.value);
    if (!userId) return undefined;
    return storage.get(userId);
  }

  public async store(user: User) {
    storage.set(user.id.value, user);
    usernameToUserIdMap.set(user.username.value, user.id.value);
    user.refreshTokens.forEach((refreshToken) => {
      refreshTokenToUserIdMap.set(refreshToken.value, user.id.value);
    });
  }
}
