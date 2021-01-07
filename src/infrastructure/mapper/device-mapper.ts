import { Prisma, Device as PrismaDevice } from '@prisma/client';
import { Device } from '../../domain/entity/device';
import { IpAddress } from '../../domain/value-object/ip-address';
import { UserAgent } from '../../domain/value-object/user-agent';

export class DeviceMapper {
  public static toDomain(prismaDevice: PrismaDevice): Device {
    return new Device({
      ipAddress: new IpAddress(prismaDevice.id),
      userAgent: new UserAgent(prismaDevice.userAgent),
    });
  }

  public static toPersistence(device: Device): Prisma.DeviceCreateInput {
    return {
      id: device.id.value,
      browserName: device.userAgent.browser.name ?? null,
      model: device.userAgent.device.model ?? null,
      os: device.userAgent.os.name ?? null,
      type: device.userAgent.device.type ?? null,
      userAgent: device.userAgent.value,
      vendor: device.userAgent.device.vendor ?? null,
    };
  }
}
