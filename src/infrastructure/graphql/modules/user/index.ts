import * as userResolvers from './resolvers';
import { userTypeDefs } from './typedefs';
import { GraphQLModule } from '~lib/graphql/types';

export const UserModule: GraphQLModule = {
  typeDefs: [userTypeDefs],
  resolvers: Object.values(userResolvers),
};
