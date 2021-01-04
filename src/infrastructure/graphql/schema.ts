import { gql } from 'apollo-server-express';
import * as directives from './directives';
import * as modules from './modules';
import { GraphQLSchema } from '~lib/graphql/grapqhl-schema';

export class Schema extends GraphQLSchema {
  public readonly baseTypeDefs = gql`
    # SHARED
    interface Error {
      message: String!
    }

    # ROOT TYPES
    type Mutation
    type Query
  `;

  public readonly directives = [directives];

  public readonly modules = [modules];
}
