import assert from 'assert';
import { UserEventTypes } from '../../event/event-types';
import { UserAccessTokenCreatedEvent } from '../../event/user-access-token-created-event';
import { UserCreatedEvent } from '../../event/user-created-event';
import { UserRefreshTokenCreatedEvent } from '../../event/user-refresh-token-created-event';
import { UserRefreshTokenExtendedEvent } from '../../event/user-refresh-token-extended-event';
import { AccessToken } from '../value-object/access-token';
import { Password } from '../value-object/password';
import { Username } from '../value-object/username';
import { Device } from './device';
import { RefreshToken } from './refresh-token';
import { AggregateRoot } from '~lib/domain/aggregate-root';
import { Identifier } from '~lib/domain/identifier';
import { PickPartial } from '~lib/helpers/helper-types';

interface UserProps {
  username: Username;
  password: Password;
  refreshTokens: RefreshToken[];
}

type UserConstructorProps = PickPartial<UserProps, 'refreshTokens'>;

export class User extends AggregateRoot<UserProps, UserEventTypes> {
  public constructor({ refreshTokens = [], ...rest }: UserConstructorProps, id?: Identifier) {
    super({ refreshTokens, ...rest }, id);
  }

  public get username() {
    return this.props.username;
  }

  public get password() {
    return this.props.password;
  }

  public get refreshTokens() {
    return this.props.refreshTokens;
  }

  public createAccessTokenForDevice(device: Device) {
    const refreshToken = this.findRefreshTokenForDevice(device);

    assert(refreshToken, 'Unable to create AccessToken: could not find RefreshToken');

    const accessToken = new AccessToken({ user: this });
    this.events.add(new UserAccessTokenCreatedEvent(this, accessToken));

    return accessToken;
  }

  public findRefreshTokenForDevice(device: Device) {
    return this.props.refreshTokens.find((token) => token.device.id.equals(device.id));
  }

  public signIn({ password, device }: { password: string; device: Device }) {
    assert(this.password.equals(password), 'Unable to sign in: invalid credentials');

    const existingRefreshToken = this.findRefreshTokenForDevice(device);

    if (existingRefreshToken) {
      existingRefreshToken.extend();

      this.events.add(new UserRefreshTokenExtendedEvent(this, existingRefreshToken));
    } else {
      const refreshToken = new RefreshToken({ device });

      this.props.refreshTokens.push(refreshToken);
      this.events.add(new UserRefreshTokenCreatedEvent(this, refreshToken));
    }

    this.createAccessTokenForDevice(device);
  }

  protected createCreatedEvent() {
    return new UserCreatedEvent(this);
  }
}
