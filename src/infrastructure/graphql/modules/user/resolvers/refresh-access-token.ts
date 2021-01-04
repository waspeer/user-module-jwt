import { RefreshAccessTokenCommand } from '../../../../../application/command/refresh-access-token/refresh-access-token-command';
import { RefreshToken } from '../../../../../domain/entity/refresh-token';
import { UserAccessTokenRefreshedEvent, UserEventTypes } from '../../../../../event/event-types';
import { GraphQLContext } from '../../../context';
import { MutationResolvers } from '../../../generated-types';
import { GraphQLResolver, ResolverArgs, ResolverParent } from '~lib/graphql/graphql-resolver';
import { getEnvironmentVariable } from '~lib/helpers/get-environment-variable';

interface RefreshAccessTokenResolverDependencies {
  refreshAccessTokenCommand: RefreshAccessTokenCommand;
}

type ResolverFn = NonNullable<MutationResolvers['refreshAccessToken']>;
type Parent = ResolverParent<ResolverFn>;
type Args = ResolverArgs<ResolverFn>;

const NODE_ENV = getEnvironmentVariable('NODE_ENV', 'development');

export class RefreshAccessToken extends GraphQLResolver<ResolverFn> {
  public path = ['Mutation', 'refreshAccessToken'] as const;
  private readonly refreshAccessTokenCommand: RefreshAccessTokenCommand;

  public constructor({ refreshAccessTokenCommand }: RefreshAccessTokenResolverDependencies) {
    super();
    this.refreshAccessTokenCommand = refreshAccessTokenCommand;
  }

  public async resolve(_parent: Parent, _args: Args, { response, request }: GraphQLContext) {
    try {
      await this.refreshAccessTokenCommand.execute({
        ipAddress: (request.headers['x-forwarded-for'] ||
          request.connection.remoteAddress) as string,
        refreshToken: request.cookies.rt, // TODO get cookie name from env variables
      });
    } catch (error) {
      response.clearCookie('rt'); // TODO env var bla

      throw error;
    }

    const refreshedEvent = this.refreshAccessTokenCommand.findEmittedEvent<UserAccessTokenRefreshedEvent>(
      UserEventTypes.AccessTokenRefreshed,
    );

    if (!refreshedEvent) {
      throw new Error('Unexpected error while signing in');
    }

    // TODO set name as env variable
    // TODO refactor this into some kind of utility function
    response.cookie('rt', refreshedEvent.payload.refreshToken, {
      httpOnly: true,
      maxAge: RefreshToken.LIFETIME,
      secure: NODE_ENV === 'production',
      // TODO sign cookie?
      sameSite: 'lax',
    });

    return {
      __typename: 'RefreshAccessTokenSuccessPayload' as const,
      accessToken: refreshedEvent.payload.accessToken,
    };
  }
}
