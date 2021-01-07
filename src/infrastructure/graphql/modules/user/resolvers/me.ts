import { GetUserByUsernameQuery } from '../../../../../application/query/get-user-by-username/get-user-by-username-query';
import { UserDTO } from '../../../../../domain/dto/user-dto';
import { UserMapper } from '../../../../mapper/user-mapper';
import { GraphQLContext } from '../../../context';
import { QueryResolvers } from '../../../graphql-types.gen';
import { GraphQLResolver } from '~lib/graphql/graphql-resolver';
import { ResolverArgs, ResolverParent, ResolverResult } from '~lib/graphql/types';

interface meResolverDependencies {
  getUserByUsernameQuery: GetUserByUsernameQuery;
}

type ResolverFn = NonNullable<QueryResolvers['me']>;
type Result = ResolverResult<ResolverFn>;
type Parent = ResolverParent<ResolverFn>;
type Args = ResolverArgs<ResolverFn>;

export class MeResolver extends GraphQLResolver<Result, Parent, Args, GraphQLContext> {
  public path = ['Query', 'me'] as const;
  private readonly getUserByUsernameQuery: GetUserByUsernameQuery;

  public constructor({ getUserByUsernameQuery }: meResolverDependencies) {
    super();
    this.getUserByUsernameQuery = getUserByUsernameQuery;
  }

  public handleError() {
    return null;
  }

  public async resolve(_parent: Parent, _args: Args, context: GraphQLContext) {
    const { username } = context.user as UserDTO;
    const user = await this.getUserByUsernameQuery.execute({ username });

    return {
      __typename: 'User' as const,
      ...UserMapper.toDTO(user),
    };
  }
}
