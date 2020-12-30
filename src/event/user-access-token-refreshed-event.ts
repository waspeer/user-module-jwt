import type { RefreshToken } from '../domain/entity/refresh-token';
import type { User } from '../domain/entity/user';
import type { AccessToken } from '../domain/value-object/access-token';
import type { UserAccessTokenRefreshedEvent as IUserAccessTokenRefreshedEvent } from './event-types';
import { UserEventTypes } from './event-types';
import { Event } from '~lib/events/event';

interface UserAccessTokenRefreshedEventProps {
  accessToken: AccessToken;
  refreshToken: RefreshToken;
}

export class UserAccessTokenRefreshedEvent extends Event<IUserAccessTokenRefreshedEvent> {
  public constructor(
    user: User,
    { accessToken, refreshToken }: UserAccessTokenRefreshedEventProps,
  ) {
    super({
      aggregate: user,
      payload: {
        accessToken: accessToken.value,
        deviceId: refreshToken.device.id.value,
        refreshToken: refreshToken.value,
      },
      type: UserEventTypes.AccessTokenRefreshed,
    });
  }
}
