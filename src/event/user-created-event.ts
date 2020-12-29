import type { User } from '../domain/entity/user';
import type { UserCreatedEvent as IUserCreatedEvent } from './event-types';
import { UserEventTypes } from './event-types';
import { Event } from '~lib/events/event';

export class UserCreatedEvent extends Event<IUserCreatedEvent> {
  public constructor(user: User) {
    super({
      aggregate: user,
      payload: { user },
      type: UserEventTypes.Created,
    });
  }
}
