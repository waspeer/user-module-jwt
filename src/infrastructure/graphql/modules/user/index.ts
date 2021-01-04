import * as userResolvers from './resolvers';
import { userTypeDefs } from './typedefs';
import { GraphQLModule } from '~lib/graphql/graphql-module';

export class UserModule extends GraphQLModule {
  public readonly typeDefs = [userTypeDefs];
  public readonly resolvers = [userResolvers];
}
