import { GetUserByUsernameQuery } from '../../../../../application/query/get-user-by-username/get-user-by-username-query';
import { UserDTO } from '../../../../../domain/dto/user-dto';
import { GraphQLContext } from '../../../context';
import { QueryResolvers } from '../../../generated-types';
import { GraphQLResolver, ResolverArgs, ResolverParent } from '~lib/graphql/graphql-resolver';

interface meResolverDependencies {
  getUserByUsernameQuery: GetUserByUsernameQuery;
}

type ResolverFn = NonNullable<QueryResolvers['me']>;
type Parent = ResolverParent<ResolverFn>;
type Args = ResolverArgs<ResolverFn>;

export class MeResolver extends GraphQLResolver<ResolverFn> {
  public path = ['Query', 'me'] as const;
  private readonly getUserByUsernameQuery: GetUserByUsernameQuery;

  public constructor({ getUserByUsernameQuery }: meResolverDependencies) {
    super();
    this.getUserByUsernameQuery = getUserByUsernameQuery;
  }

  public async resolve(_parent: Parent, _args: Args, context: GraphQLContext) {
    const user = context.user as UserDTO;
    const userDTO = await this.getUserByUsernameQuery.execute({ username: user.username });

    return {
      __typename: 'User' as const,
      ...userDTO,
    };
  }
}
