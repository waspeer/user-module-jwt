import { User } from '../domain/entity/user';
import type { DomainEventEmitter, Event } from '~lib/events/types';

export enum UserEventTypes {
  AccessTokenRefreshed = 'user.accessTokenRefreshed',
  Created = 'user.created',
  SignedIn = 'user.signedIn',
  SignedOut = 'user.signedOut',
}

export type UserDomainEventEmitter = DomainEventEmitter<UserEventTypes>;

export type UserAccessTokenRefreshedEvent = Event<
  UserEventTypes.AccessTokenRefreshed,
  {
    accessToken: string;
    ipAddress: string;
    refreshToken: string;
  }
>;

export type UserCreatedEvent = Event<UserEventTypes.Created, { user: User }>;

export type UserSignedInEvent = Event<
  UserEventTypes.SignedIn,
  {
    accessToken: string;
    ipAddress: string;
    refreshToken: string;
  }
>;

export type UserSignedOutEvent = Event<
  UserEventTypes.SignedOut,
  { invalidatedRefreshToken: string }
>;
