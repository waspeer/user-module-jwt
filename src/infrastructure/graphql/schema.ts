import * as directives from './directives';
import * as modules from './modules';
import { GraphQLSchema } from '~lib/graphql/grapqhl-schema';

export class Schema extends GraphQLSchema {
  public readonly baseTypeDefs = /* GraphQL */ `
    # SHARED
    interface Error {
      message: String!
    }

    # ROOT TYPES
    type Mutation
    type Query
  `;

  public readonly directives = Object.values(directives);
  public readonly modules = Object.values(modules);
}
