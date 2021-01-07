import { RefreshToken } from '../../domain/entity/refresh-token';
import { User } from '../../domain/entity/user';
import { Device } from 'domain/entity/device';
import { Identifier } from '~lib/domain/identifier';

export interface StoredRefreshToken {
  deviceId: string;
  refreshToken: string;
  userId: string;
}

// type RedisSetParameters = Parameters<Redis['set']>;
// type FirstFour<T extends unknown[]> = T extends [infer A, infer B, infer C, infer D, ...any[]]
//   ? [A, B, C, D]
//   : unknown;
// type ToPersistenceResult = FirstFour<RedisSetParameters>;

export class RefreshTokenMapper {
  public static toDomain(data: StoredRefreshToken, device: Device): RefreshToken {
    return new RefreshToken({ device }, new Identifier(data.refreshToken));
  }

  public static toPersistence(refreshToken: RefreshToken, user: User) {
    const tokenData: StoredRefreshToken = {
      deviceId: refreshToken.device.id.value,
      refreshToken: refreshToken.value,
      userId: user.id.value,
    };
    const refreshTokenKey = `rt:${refreshToken.id.value}`;
    const userKey = `user:${user.id.value}`;
    const expiresAt = refreshToken.expiresAt.getTime();
    const fields = Object.entries(tokenData).flat();

    return { expiresAt, fields, refreshTokenKey, userKey };
  }
}
