import type { DocumentNode } from 'graphql';
import { GraphQLResolver } from './graphql-resolver';

type Cradle = any;

interface ResolverClass {
  new (cradle: Cradle): GraphQLResolver<any>;
}

export abstract class GraphQLModule {
  public abstract typeDefs: DocumentNode[];
  public abstract resolvers: Record<string, ResolverClass>[];
}
