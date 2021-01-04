import { asClass, AwilixContainer, createContainer } from 'awilix';
import { RefreshAccessTokenCommand } from '../application/command/refresh-access-token/refresh-access-token-command';
import { SignInCommand } from '../application/command/sign-in/sign-in-command';
import { SignOutCommand } from '../application/command/sign-out/sign-out-command';
import { SignUpCommand } from '../application/command/sign-up/sign-up-command';
import { UserRepository } from '../domain/repository/user-repository';
import { UserDomainEventEmitter } from '../event/event-types';
import { ExpressServer } from './express-server';
import { Schema } from './graphql/schema';
import { InMemoryUserRepository } from './repository/inmemory-user-repository';
import type { Server } from './types';
import { WinstonLogger } from './winston-logger';
import { GetUserByUsernameQuery } from 'application/query/get-user-by-username/get-user-by-username-query';
import { NodeDomainEventEmitter } from '~lib/events/node-domain-event-emitter';
import { GraphQLSchema } from '~lib/graphql/grapqhl-schema';
import { Logger } from '~lib/logger';

export class UserDIContainer {
  private readonly container: AwilixContainer;

  public constructor() {
    this.container = createContainer().register({
      ///
      // SHARED
      ///
      domainEventEmitter: asClass<UserDomainEventEmitter>(NodeDomainEventEmitter),
      logger: asClass<Logger>(WinstonLogger),

      ///
      // INFRASTRUCTURE
      ///
      schema: asClass<GraphQLSchema>(Schema).singleton(),
      server: asClass<Server>(ExpressServer).singleton(),

      // -- repository
      userRepository: asClass<UserRepository>(InMemoryUserRepository),

      ///
      // APPLICATION
      ///
      getUserByUsernameQuery: asClass(GetUserByUsernameQuery),
      refreshAccessTokenCommand: asClass(RefreshAccessTokenCommand),
      signInCommand: asClass(SignInCommand),
      signOutCommand: asClass(SignOutCommand),
      signUpCommand: asClass(SignUpCommand),
    });
  }

  public get<T = unknown>(name: string) {
    return this.container.resolve<T>(name);
  }
}
