import { RefreshToken } from '../domain/entity/refresh-token';
import type { User } from '../domain/entity/user';
import { UserEventTypes } from './event-types';
import type { UserRefreshTokenCreatedEvent as IUserRefreshTokenCreatedEvent } from './event-types';
import { Event } from '~lib/events/event';

export class UserRefreshTokenCreatedEvent extends Event<IUserRefreshTokenCreatedEvent> {
  public constructor(user: User, refreshToken: RefreshToken) {
    super({
      aggregate: user,
      payload: { refreshToken },
      type: UserEventTypes.RefreshTokenCreated,
    });
  }
}
