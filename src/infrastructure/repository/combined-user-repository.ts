import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';
import { User } from '../../domain/entity/user';
import { UserRepository } from '../../domain/repository/user-repository';
import { Username } from '../../domain/value-object/username';
import { DeviceMapper } from '../mapper/device-mapper';
import { RefreshTokenMapper, StoredRefreshToken } from '../mapper/refresh-token-mapper';
import { UserMapper } from '../mapper/user-mapper';
import { Identifier } from '~lib/domain/identifier';
import { getEnvironmentVariable } from '~lib/helpers/get-environment-variable';

const prisma = new PrismaClient();
const redis = new Redis(getEnvironmentVariable('REDIS_URL'));

export class PrismaUserRepository implements UserRepository {
  public async findByRefreshTokenId(identifier: Identifier) {
    const tokenKey = `rt:${identifier.value}`;
    const tokenData = ((await redis.hgetall(tokenKey)) as unknown) as StoredRefreshToken | null;

    if (!tokenData) {
      return undefined;
    }

    const userData = await prisma.user.findUnique({ where: { id: tokenData.userId } });

    if (!userData) {
      return undefined;
    }

    const userKey = `user:${userData.id}`;

    await redis.zremrangebyscore(userKey, '-inf', Date.now().toString());

    const refreshTokenKeys = await redis.zrangebyscore(userKey, Date.now(), '+inf');
    const refreshTokens = await Promise.all(
      refreshTokenKeys.map(async (refreshTokenKey) => {
        const tokenData = ((await redis.hgetall(refreshTokenKey)) as unknown) as StoredRefreshToken;
        const deviceData = await prisma.device.findUnique({ where: { id: tokenData.deviceId } });

        if (!deviceData) {
          throw new Error('Wuuuuut'); // TODO
        }

        return RefreshTokenMapper.toDomain(tokenData, DeviceMapper.toDomain(deviceData));
      }),
    );

    return UserMapper.toDomain(userData, refreshTokens);
  }

  public async findByUsername(username: Username) {
    const userData = await prisma.user.findUnique({ where: { username: username.value } });

    if (!userData) {
      return undefined;
    }

    const userKey = `user:${userData.id}`;

    await redis.zremrangebyscore(userKey, '-inf', Date.now().toString());

    const refreshTokenKeys = await redis.zrangebyscore(userKey, Date.now(), '+inf');
    const refreshTokens = await Promise.all(
      refreshTokenKeys.map(async (refreshTokenKey) => {
        const tokenData = ((await redis.hgetall(refreshTokenKey)) as unknown) as StoredRefreshToken;
        const deviceData = await prisma.device.findUnique({ where: { id: tokenData.deviceId } });

        if (!deviceData) {
          throw new Error('Wuuuuut'); // TODO
        }

        return RefreshTokenMapper.toDomain(tokenData, DeviceMapper.toDomain(deviceData));
      }),
    );

    return UserMapper.toDomain(userData, refreshTokens);
  }

  public async store(user: User) {
    const devices = user.refreshTokens.map((refreshToken) => refreshToken.device);

    await prisma.$transaction([
      prisma.user.upsert({
        create: UserMapper.toPersistence(user),
        update: UserMapper.toPersistence(user),
        where: { id: user.id.value },
      }),
      ...devices.map((device) =>
        prisma.device.upsert({
          create: DeviceMapper.toPersistence(device),
          update: DeviceMapper.toPersistence(device),
          where: { id: device.id.value },
        }),
      ),
    ] as any);

    const userKey = `user:${user.id.value}`;

    await redis.zremrangebyscore(userKey, '-inf', Date.now().toString());

    const refreshTokenKeys = await redis.zrangebyscore(userKey, Date.now(), '+inf');
    const userTokens = user.refreshTokens.map(({ value }) => value);
    const tokenKeysToRemove = refreshTokenKeys.filter(
      (key) => !userTokens.some((userToken) => key.endsWith(userToken)),
    );

    if (tokenKeysToRemove.length) {
      await redis
        .multi()
        .zrem(userKey, ...tokenKeysToRemove)
        .del(...tokenKeysToRemove)
        .exec();
    }

    await Promise.all(
      user.refreshTokens
        .map((refreshToken) => RefreshTokenMapper.toPersistence(refreshToken, user))
        .map(({ fields, expiresAt, refreshTokenKey, userKey }) => {
          const transaction = redis
            .multi()
            .hmset(refreshTokenKey, ...fields)
            .pexpireat(refreshTokenKey, expiresAt)
            .zadd(userKey, expiresAt.toString(), refreshTokenKey)
            .pexpireat(userKey, expiresAt);

          return transaction.exec();
        }),
    );
  }
}
