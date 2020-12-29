import type { DomainEventEmitter, Event } from '~lib/events/types';

export enum UserEventTypes {
  Created = 'user.created',
  SignedIn = 'user.signedIn',
}

export type UserDomainEventEmitter = DomainEventEmitter<UserEventTypes>;

export type UserSignedInEvent = Event<
  UserEventTypes.SignedIn,
  {
    accessToken: string;
    deviceId: string;
    refreshToken: string;
  }
>;
