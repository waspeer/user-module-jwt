import faker from 'faker';
import { Device } from '../../src/domain/entity/device';
import { IpAddress } from '../../src/domain/value-object/ip-address';
import { UserAgent } from '../../src/domain/value-object/user-agent';

interface CreateDeviceProps {
  ipAddress?: string;
  userAgent?: string;
}

export function createDevice({
  ipAddress = faker.internet.ip(),
  userAgent = faker.internet.userAgent(),
}: CreateDeviceProps = {}) {
  return new Device({
    ipAddress: new IpAddress(ipAddress),
    userAgent: new UserAgent(userAgent),
  });
}
