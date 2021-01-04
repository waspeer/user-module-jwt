import { ApolloServer } from 'apollo-server-express';
import cookieParser from 'cookie-parser';
import type { Express } from 'express';
import express from 'express';
import { createGraphQLContext } from './graphql/context';
import type { Server } from './types';
import type { GraphQLSchema } from '~lib/graphql/grapqhl-schema';

interface ExpressServerDependencies {
  schema: GraphQLSchema;
}

export class ExpressServer implements Server {
  private readonly app: Express;

  public constructor({ schema }: ExpressServerDependencies) {
    const app = express();
    const graphQLServer = new ApolloServer({
      context: createGraphQLContext,
      schema: schema.makeExecutableSchema(),
    });

    app.use(cookieParser());
    graphQLServer.applyMiddleware({ app });

    this.app = app;
  }

  public async start() {
    this.app.listen({ port: 4000 }, () => {
      console.log('Server listening http://localhost:4000/graphql...');
    });
  }
}
