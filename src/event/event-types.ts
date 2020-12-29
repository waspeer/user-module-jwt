import type { RefreshToken } from '../domain/entity/refresh-token';
import type { User } from '../domain/entity/user';
import type { AccessToken } from '../domain/value-object/access-token';
import type { DomainEventEmitter, Event } from '~lib/events/types';

export enum UserEventTypes {
  AccessTokenCreated = 'user.accessToken.created',
  Created = 'user.created',
  RefreshTokenCreated = 'user.refreshToken.created',
  RefreshTokenExtended = 'user.refreshToken.extended',
}

export type UserDomainEventEmitter = DomainEventEmitter<UserEventTypes>;

export type UserAccessTokenCreatedEvent = Event<
  UserEventTypes.AccessTokenCreated,
  { accessToken: AccessToken }
>;

export type UserCreatedEvent = Event<UserEventTypes.Created, { user: User }>;

export type UserRefreshTokenCreatedEvent = Event<
  UserEventTypes.RefreshTokenCreated,
  { refreshToken: RefreshToken }
>;

export type UserRefreshTokenExtendedEvent = Event<
  UserEventTypes.RefreshTokenExtended,
  { refreshToken: RefreshToken }
>;
