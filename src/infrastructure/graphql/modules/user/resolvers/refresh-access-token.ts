import { RefreshAccessTokenCommand } from '../../../../../application/command/refresh-access-token/refresh-access-token-command';
import { UserAccessTokenRefreshedEvent, UserEventTypes } from '../../../../../event/event-types';
import { GraphQLContext } from '../../../context';
import { MutationResolvers } from '../../../graphql-types.gen';
import { CookieUtil } from '../../../util/cookie';
import { GraphQLResolver } from '~lib/graphql/graphql-resolver';
import { ResolverArgs, ResolverParent, ResolverResult } from '~lib/graphql/types';

interface RefreshAccessTokenResolverDependencies {
  refreshAccessTokenCommand: RefreshAccessTokenCommand;
}

type ResolverFn = NonNullable<MutationResolvers['refreshAccessToken']>;
type Result = ResolverResult<ResolverFn>;
type Parent = ResolverParent<ResolverFn>;
type Args = ResolverArgs<ResolverFn>;

export class RefreshAccessToken extends GraphQLResolver<Result, Parent, Args, GraphQLContext> {
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
        refreshToken: CookieUtil.getRefreshTokenCookie(request),
      });
    } catch (error) {
      CookieUtil.clearRefreshTokenCookie(response);

      throw error;
    }

    const refreshedEvent = this.refreshAccessTokenCommand.findEmittedEvent<UserAccessTokenRefreshedEvent>(
      UserEventTypes.AccessTokenRefreshed,
    );

    if (!refreshedEvent) {
      throw new Error('Unexpected error while signing in');
    }

    CookieUtil.setRefreshTokenCookie(response, refreshedEvent.payload.refreshToken);

    return {
      __typename: 'RefreshAccessTokenSuccessPayload' as const,
      accessToken: refreshedEvent.payload.accessToken,
    };
  }
}
