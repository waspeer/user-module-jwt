import { SignInCommand } from '../../../../../application/command/sign-in/sign-in-command';
import { UserEventTypes, UserSignedInEvent } from '../../../../../event/event-types';
import { GraphQLContext } from '../../../context';
import { MutationResolvers } from '../../../graphql-types.gen';
import { CookieUtil } from '../../../util/cookie';
import { GraphQLResolver } from '~lib/graphql/graphql-resolver';
import { ResolverArgs, ResolverParent, ResolverResult } from '~lib/graphql/types';

interface SignInResolverDependencies {
  signInCommand: SignInCommand;
}

type ResolverFn = NonNullable<MutationResolvers['signIn']>;
type Result = ResolverResult<ResolverFn>;
type Parent = ResolverParent<ResolverFn>;
type Args = ResolverArgs<ResolverFn>;

export class SignInResolver extends GraphQLResolver<Result, Parent, Args, GraphQLContext> {
  public path = ['Mutation', 'signIn'] as const;
  public signInCommand: SignInCommand;

  public constructor({ signInCommand }: SignInResolverDependencies) {
    super();
    this.signInCommand = signInCommand;
  }

  public async resolve(_parent: Parent, { input }: Args, { response, request }: GraphQLContext) {
    await this.signInCommand.execute({
      ipAddress: (request.headers['x-forwarded-for'] || request.connection.remoteAddress) as string,
      password: input.password,
      userAgent: request.get('user-agent') ?? '',
      username: input.username,
    });

    const signInEvent = this.signInCommand.findEmittedEvent<UserSignedInEvent>(
      UserEventTypes.SignedIn,
    );

    if (!signInEvent) {
      throw new Error('Unexpected error while signing in');
    }

    CookieUtil.setRefreshTokenCookie(response, signInEvent.payload.refreshToken);

    return {
      __typename: 'SignInSuccessPayload' as const,
      accessToken: signInEvent.payload.accessToken,
    };
  }
}
