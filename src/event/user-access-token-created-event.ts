import type { User } from '../domain/entity/user';
import type { AccessToken } from '../domain/value-object/access-token';
import { UserEventTypes } from './event-types';
import type { UserAccessTokenCreatedEvent as IUserAccessTokenCreatedEvent } from './event-types';
import { Event } from '~lib/events/event';

export class UserAccessTokenCreatedEvent extends Event<IUserAccessTokenCreatedEvent> {
  public constructor(user: User, accessToken: AccessToken) {
    super({
      aggregate: user,
      payload: { accessToken },
      type: UserEventTypes.AccessTokenCreated,
    });
  }
}
