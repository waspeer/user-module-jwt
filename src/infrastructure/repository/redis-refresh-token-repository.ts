import Redis from 'ioredis';
import { User } from '../../domain/entity/user';
import type { RefreshTokenRepository } from './types';
import { RefreshToken } from 'domain/entity/refresh-token';
import { IpAddress } from 'domain/value-object/ip-address';
import { UserAgent } from 'domain/value-object/user-agent';
import { Identifier } from '~lib/domain/identifier';
import { getEnvironmentVariable } from '~lib/helpers/get-environment-variable';

interface StoredRefreshToken {
  ipAddress: string;
  refreshToken: string;
  userAgent: string;
  userId: string;
}

const redis = new Redis(getEnvironmentVariable('REDIS_URL'));

/**
 * Redis implementation of RefreshTokenRepository
 *
 * The repository maintains two datapoints per RefreshToken:
 *   - A hash containing the RefreshToken data {StoredRefreshToken}.
 *     The key has a TTL matching its expire date.
 *   - A sorted set for the associated user containing all its
 *     RefreshToken keys, scored by their expiresAt date (in ms).
 *     This way valid RefreshToken keys can easily be queried per
 *     user (range: now() - +inf) and stale members can easily be
 *     removed (range -inf - now()).
 */

export class RedisRefreshTokenRepository implements RefreshTokenRepository {
  public async findAssociatedUserIdById(identifier: Identifier) {
    const refreshTokenKey = this.getRefreshTokenKey(identifier);
    const refreshTokenData = await this.getTokenData(refreshTokenKey);

    if (!refreshTokenData) {
      return undefined;
    }

    return new Identifier(refreshTokenData.userId);
  }

  public async getRefreshTokensByUserId(userIdentifier: Identifier) {
    const userKey = this.getUserKey(userIdentifier);
    const refreshTokenKeys = await this.getRefreshTokenKeysByUserKey(userKey);

    const refreshTokens = await Promise.all(
      refreshTokenKeys.map(async (tokenKey) => {
        const refreshTokenData = await this.getTokenData(tokenKey);

        return this.mapRefreshTokenToDomain(refreshTokenData);
      }),
    );

    return refreshTokens;
  }

  public async storeRefreshTokensForUser(user: User) {
    const userKey = this.getUserKey(user.id);
    const storedKeys = await this.getRefreshTokenKeysByUserKey(userKey);

    const keysToStore = user.refreshTokens.map(({ id }) => this.getRefreshTokenKey(id));
    const staleKeys = storedKeys.filter((storedKey) => !keysToStore.includes(storedKey));

    if (staleKeys.length) {
      await redis
        .multi()
        .zrem(userKey, ...staleKeys)
        .del(...staleKeys)
        .exec();
    }

    await Promise.all(
      user.refreshTokens.map((refreshToken) => {
        const key = this.getRefreshTokenKey(refreshToken.id);
        const flattenedData = this.mapRefeshTokenToPersistence(refreshToken, user);
        const expiresAt = refreshToken.expiresAt.getTime();

        return (
          redis
            .multi()
            // Set a hash for the RefreshToken with TTL matching token expiresAt date
            .hmset(key, ...flattenedData)
            .pexpireat(key, expiresAt)
            // Add RefreshToken key to sorted set of user, scored by expire date
            .zadd(userKey, expiresAt.toString(), key)
            .pexpireat(userKey, expiresAt)
            .exec()
        );
      }),
    );
  }

  ///
  // UTILITY
  ///

  private getUserKey(userIdentifier: Identifier) {
    return `user:${userIdentifier.value}`;
  }

  private async getTokenData(tokenKey: string) {
    const tokenData = ((await redis.hgetall(tokenKey)) as unknown) as StoredRefreshToken;
    return tokenData;
  }

  private getRefreshTokenKey(tokenIdentifier: Identifier) {
    return `rt:${tokenIdentifier.value}`;
  }

  private async getRefreshTokenKeysByUserKey(userKey: string) {
    // Removes stale associations between user and token
    await redis.zremrangebyscore(userKey, '-inf', Date.now().toString());
    const tokenKeys = await redis.zrangebyscore(userKey, Date.now(), '+inf');

    return tokenKeys;
  }

  ///
  // MAPPERS
  ///

  private mapRefreshTokenToDomain(tokenData: StoredRefreshToken): RefreshToken {
    const ipAddress = new IpAddress(tokenData.ipAddress);
    const userAgent = new UserAgent(tokenData.userAgent);

    return new RefreshToken({ ipAddress, userAgent }, new Identifier(tokenData.refreshToken));
  }

  private mapRefeshTokenToPersistence(refreshToken: RefreshToken, user: User): string[] {
    const tokenData: StoredRefreshToken = {
      ipAddress: refreshToken.ipAddress.value,
      refreshToken: refreshToken.value,
      userAgent: refreshToken.userAgent.value,
      userId: user.id.value,
    };

    return Object.entries(tokenData).flat();
  }
}
