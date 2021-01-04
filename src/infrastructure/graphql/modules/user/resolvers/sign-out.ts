import { SignOutCommand } from '../../../../../application/command/sign-out/sign-out-command';
import { GraphQLContext } from '../../../context';
import { MutationResolvers } from '../../../generated-types';
import { GraphQLResolver, ResolverArgs, ResolverParent } from '~lib/graphql/graphql-resolver';

interface SignOutResolverDependencies {
  signOutCommand: SignOutCommand;
}

type ResolverFn = NonNullable<MutationResolvers['signOut']>;
type Parent = ResolverParent<ResolverFn>;
type Args = ResolverArgs<ResolverFn>;

export class SignOutResolver extends GraphQLResolver<ResolverFn> {
  public path = ['Mutation', 'signOut'] as const;
  public signOutCommand: SignOutCommand;

  public constructor({ signOutCommand }: SignOutResolverDependencies) {
    super();
    this.signOutCommand = signOutCommand;
  }

  public async resolve(_parent: Parent, _args: Args, { response, request }: GraphQLContext) {
    const refreshToken = request.cookies.rt; // TODO

    if (!refreshToken) {
      // TODO
      throw new Error('AAAaaaaAAA');
    }

    await this.signOutCommand.execute({ refreshToken });

    response.clearCookie('rt'); // TODO

    return {
      __typename: 'SignOutSuccessPayload' as const,
    };
  }
}
