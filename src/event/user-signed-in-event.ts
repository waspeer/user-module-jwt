import type { RefreshToken } from '../domain/entity/refresh-token';
import type { User } from '../domain/entity/user';
import type { AccessToken } from '../domain/value-object/access-token';
import type { UserSignedInEvent as IUserSignedInEvent } from './event-types';
import { UserEventTypes } from './event-types';
import { Event } from '~lib/events/event';

interface UserSignedInEventProps {
  accessToken: AccessToken;
  refreshToken: RefreshToken;
}

export class UserSignedInEvent extends Event<IUserSignedInEvent> {
  public constructor(user: User, { accessToken, refreshToken }: UserSignedInEventProps) {
    super({
      aggregate: user,
      payload: {
        accessToken: accessToken.value,
        ipAddress: refreshToken.ipAddress.value,
        refreshToken: refreshToken.value,
      },
      type: UserEventTypes.SignedIn,
    });
  }
}
