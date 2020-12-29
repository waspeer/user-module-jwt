import assert from 'assert';
import type { Device } from './device';
import { Entity } from '~lib/domain/entity';
import type { Identifier } from '~lib/domain/identifier';
import type { PickPartial } from '~lib/helpers/helper-types';

interface RefreshTokenProps {
  expiresAt: Date;
  device: Device;
}

type RefreshTokenConstructorProps = PickPartial<RefreshTokenProps, 'expiresAt'>;

const TWO_DAYS = 2 * 24 * 60 * 60 * 1000;

export class RefreshToken extends Entity<RefreshTokenProps> {
  static LIFETIME = TWO_DAYS;

  public constructor(props: RefreshTokenConstructorProps, id?: Identifier) {
    const expiresAt = props.expiresAt ?? new Date(Date.now() + RefreshToken.LIFETIME);
    super({ ...props, expiresAt }, id);
  }

  public get device() {
    return this.props.device;
  }

  public get expiresAt() {
    return this.props.expiresAt;
  }

  public get isValid() {
    return this.props.expiresAt.getTime() > Date.now();
  }

  public get value() {
    // The token value is the same as the id of the RefreshToken
    return this.id.value;
  }

  public extend() {
    assert(this.isValid, 'Unable to extend RefreshToken: cannot extend an expired token');

    this.props.expiresAt = new Date(Date.now() + RefreshToken.LIFETIME);
  }
}
