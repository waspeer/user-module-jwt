import faker from 'faker';
import { RefreshToken } from '../../src/domain/entity/refresh-token';
import { IpAddress } from '../../src/domain/value-object/ip-address';
import { UserAgent } from '../../src/domain/value-object/user-agent';

interface CreateRefreshTokenProps {
  expiresAt?: Date;
  ipAddress?: string;
  userAgent?: string;
}

export function createRefreshToken({
  expiresAt = faker.date.between(new Date(), new Date(Date.now() + RefreshToken.LIFETIME)),
  ipAddress = faker.internet.ip(),
  userAgent = faker.internet.userAgent(),
}: CreateRefreshTokenProps = {}) {
  return new RefreshToken({
    expiresAt,
    ipAddress: new IpAddress(ipAddress),
    userAgent: new UserAgent(userAgent),
  });
}
