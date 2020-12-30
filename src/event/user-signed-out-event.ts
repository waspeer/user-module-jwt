import type { RefreshToken } from '../domain/entity/refresh-token';
import type { User } from '../domain/entity/user';
import type { UserSignedOutEvent as IUserSignedOutEvent } from './event-types';
import { UserEventTypes } from './event-types';
import { Event } from '~lib/events/event';

interface UserSignedOutEventProps {
  invalidatedRefreshToken: RefreshToken;
}

export class UserSignedOutEvent extends Event<IUserSignedOutEvent> {
  public constructor(user: User, { invalidatedRefreshToken }: UserSignedOutEventProps) {
    super({
      aggregate: user,
      payload: { invalidatedRefreshToken: invalidatedRefreshToken.value },
      type: UserEventTypes.SignedOut,
    });
  }
}
