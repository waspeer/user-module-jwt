import assert from 'assert';
import { UserEventTypes } from '../../event/event-types';
import { UserCreatedEvent } from '../../event/user-created-event';
import { UserSignedInEvent } from '../../event/user-signed-in-event';
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

    return new AccessToken({ user: this });
  }

  public findRefreshTokenForDevice(device: Device) {
    return this.props.refreshTokens.find((token) => token.device.id.equals(device.id));
  }

  public signIn({ password, device }: { password: string; device: Device }) {
    assert(this.password.equals(password), 'Unable to sign in: invalid credentials');

    let refreshToken: RefreshToken;
    const existingRefreshToken = this.findRefreshTokenForDevice(device);

    if (existingRefreshToken) {
      refreshToken = existingRefreshToken;
      refreshToken.extend();
    } else {
      refreshToken = new RefreshToken({ device });
      this.props.refreshTokens.push(refreshToken);
    }

    const accessToken = this.createAccessTokenForDevice(device);

    this.events.add(new UserSignedInEvent(this, { accessToken, refreshToken }));
  }

  protected createCreatedEvent() {
    return new UserCreatedEvent(this);
  }
}
