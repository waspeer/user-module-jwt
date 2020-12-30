import assert from 'assert';
import { UserEventTypes } from '../../event/event-types';
import { UserAccessTokenRefreshedEvent } from '../../event/user-access-token-refreshed-event';
import { UserCreatedEvent } from '../../event/user-created-event';
import { UserSignedInEvent } from '../../event/user-signed-in-event';
import { UserSignedOutEvent } from '../../event/user-signed-out-event';
import { AccessToken } from '../value-object/access-token';
import { IpAddress } from '../value-object/ip-address';
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

  public findRefreshTokenByDevice(device: Device) {
    return this.props.refreshTokens.find((token) => token.device.id.equals(device.id));
  }

  public findRefreshTokenById(refreshTokenId: Identifier) {
    return this.props.refreshTokens.find(({ id }) => id.equals(refreshTokenId));
  }

  public refreshAccessToken({
    ipAddress,
    refreshTokenId,
  }: {
    ipAddress: IpAddress;
    refreshTokenId: Identifier;
  }) {
    const refreshToken = this.findRefreshTokenById(refreshTokenId);

    assert(refreshToken, 'Unable to refresh access token: could not find refresh token');
    assert(
      refreshToken.device.ipAddress.equals(ipAddress),
      'Unable to refresh access token: IP address does not match',
    );

    const accessToken = new AccessToken({ user: this });
    refreshToken.extend();
    this.events.add(new UserAccessTokenRefreshedEvent(this, { accessToken, refreshToken }));
  }

  public signIn({ password, device }: { password: string; device: Device }) {
    assert(this.password.equals(password), 'Unable to sign in: invalid credentials');

    let refreshToken: RefreshToken;
    const existingRefreshToken = this.findRefreshTokenByDevice(device);

    if (existingRefreshToken) {
      refreshToken = existingRefreshToken;
      refreshToken.extend();
    } else {
      refreshToken = new RefreshToken({ device });
      this.props.refreshTokens.push(refreshToken);
    }

    const accessToken = new AccessToken({ user: this });
    this.events.add(new UserSignedInEvent(this, { accessToken, refreshToken }));
  }

  public signOut({ refreshTokenId }: { refreshTokenId: Identifier }) {
    const refreshTokenToInvalidate = this.findRefreshTokenById(refreshTokenId);

    assert(refreshTokenToInvalidate, 'Unable to sign out user: can not find refresh token');

    this.props.refreshTokens = this.props.refreshTokens.filter(
      (token) => token !== refreshTokenToInvalidate,
    );
    this.events.add(
      new UserSignedOutEvent(this, {
        invalidatedRefreshToken: refreshTokenToInvalidate,
      }),
    );
  }

  protected createCreatedEvent() {
    return new UserCreatedEvent(this);
  }
}
