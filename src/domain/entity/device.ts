import { IpAddress } from '../value-object/ip-address';
import { UserAgent } from '../value-object/user-agent';
import { Entity } from '~lib/domain/entity';
import { Identifier } from '~lib/domain/identifier';

interface DeviceProps {
  ipAddress: IpAddress;
  userAgent: UserAgent;
}

export class Device extends Entity<DeviceProps> {
  public constructor(props: DeviceProps, id?: Identifier) {
    super(props, id ?? new Identifier(props.ipAddress.value));
  }

  public get ipAddress() {
    return this.props.ipAddress;
  }

  public get userAgent() {
    return this.props.userAgent;
  }
}
