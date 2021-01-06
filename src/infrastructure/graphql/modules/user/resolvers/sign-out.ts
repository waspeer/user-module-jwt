import { SignOutCommand } from '../../../../../application/command/sign-out/sign-out-command';
import { GraphQLContext } from '../../../context';
import { MutationResolvers } from '../../../graphql-types.gen';
import { CookieUtil } from '../../../util/cookie';
import { GraphQLResolver } from '~lib/graphql/graphql-resolver';
import { ResolverResult, ResolverParent, ResolverArgs } from '~lib/graphql/types';

interface SignOutResolverDependencies {
  signOutCommand: SignOutCommand;
}

type ResolverFn = NonNullable<MutationResolvers['signOut']>;
type Result = ResolverResult<ResolverFn>;
type Parent = ResolverParent<ResolverFn>;
type Args = ResolverArgs<ResolverFn>;

export class SignOutResolver extends GraphQLResolver<Result, Parent, Args, GraphQLContext> {
  public path = ['Mutation', 'signOut'] as const;
  public signOutCommand: SignOutCommand;

  public constructor({ signOutCommand }: SignOutResolverDependencies) {
    super();
    this.signOutCommand = signOutCommand;
  }

  public async resolve(_parent: Parent, _args: Args, { response, request }: GraphQLContext) {
    const refreshToken = CookieUtil.getRefreshTokenCookie(request);

    await this.signOutCommand.execute({ refreshToken });
    CookieUtil.clearRefreshTokenCookie(response);

    return {
      __typename: 'SignOutSuccessPayload' as const,
    };
  }
}
