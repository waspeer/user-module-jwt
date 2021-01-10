import isIp from 'is-ip';
import { ValueObject } from '~lib/domain/value-object';
import { assert } from '~lib/errors/assert';

export class IpAddress extends ValueObject<string> {
  public constructor(ip: string) {
    assert(isIp(ip), 'Unable to create IpAddress: IP is not valid');
    super(ip);
  }
}
