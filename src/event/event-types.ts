import type { User } from '../domain/entity/user';
import type { DomainEventEmitter, Event } from '~lib/events/types';

export enum UserEventTypes {
  UserCreated = 'user.created',
}

export type UserDomainEventEmitter = DomainEventEmitter<UserEventTypes>;

export type UserCreatedEvent = Event<UserEventTypes.UserCreated, { user: User }>;
