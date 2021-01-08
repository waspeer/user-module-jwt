import { RefreshToken } from '../../domain/entity/refresh-token';
import { User } from '../../domain/entity/user';
import { IpAddress } from 'domain/value-object/ip-address';
import { UserAgent } from 'domain/value-object/user-agent';
import { Identifier } from '~lib/domain/identifier';

export interface StoredRefreshToken {
  ipAddress: string;
  refreshToken: string;
  userAgent: string;
  userId: string;
}

export class RefreshTokenMapper {
  public static toDomain(data: StoredRefreshToken): RefreshToken {
    const ipAddress = new IpAddress(data.ipAddress);
    const userAgent = new UserAgent(data.userAgent);

    return new RefreshToken({ ipAddress, userAgent }, new Identifier(data.refreshToken));
  }

  public static toPersistence(refreshToken: RefreshToken, user: User) {
    const tokenData: StoredRefreshToken = {
      ipAddress: refreshToken.ipAddress.value,
      refreshToken: refreshToken.value,
      userAgent: refreshToken.userAgent.value,
      userId: user.id.value,
    };
    const refreshTokenKey = `rt:${refreshToken.id.value}`;
    const userKey = `user:${user.id.value}`;
    const expiresAt = refreshToken.expiresAt.getTime();
    const fields = Object.entries(tokenData).flat();

    return { expiresAt, fields, refreshTokenKey, userKey };
  }
}
