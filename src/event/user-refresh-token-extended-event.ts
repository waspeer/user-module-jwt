import type { RefreshToken } from '../domain/entity/refresh-token';
import type { User } from '../domain/entity/user';
import type { UserRefreshTokenExtendedEvent as IUserRefreshTokenExtendedEvent } from './event-types';
import { UserEventTypes } from './event-types';
import { Event } from '~lib/events/event';

export class UserRefreshTokenExtendedEvent extends Event<IUserRefreshTokenExtendedEvent> {
  public constructor(user: User, refreshToken: RefreshToken) {
    super({
      aggregate: user,
      payload: { refreshToken },
      type: UserEventTypes.RefreshTokenExtended,
    });
  }
}
