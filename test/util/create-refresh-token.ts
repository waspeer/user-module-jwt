import faker from 'faker';
import { Device } from '../../src/domain/entity/device';
import { RefreshToken } from '../../src/domain/entity/refresh-token';
import { createDevice } from './create-device';

interface CreateRefreshTokenProps {
  expiresAt?: Date;
  device?: Device;
}

export function createRefreshToken({
  expiresAt = faker.date.between(new Date(), new Date(Date.now() + RefreshToken.LIFETIME)),
  device = createDevice(),
}: CreateRefreshTokenProps = {}) {
  return new RefreshToken({ expiresAt, device });
}
