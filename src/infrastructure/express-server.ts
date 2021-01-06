/* eslint-disable import/no-extraneous-dependencies */
import cookieParser from 'cookie-parser';
import type { Express } from 'express';
import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import playground from 'graphql-playground-middleware-express';
import { createGraphQLContext } from './graphql/context';
import type { Server } from './types';
import type { GraphQLSchema } from '~lib/graphql/grapqhl-schema';
import { getEnvironmentVariable } from '~lib/helpers/get-environment-variable';
import type { Logger } from '~lib/logger';

interface ExpressServerDependencies {
  logger: Logger;
  schema: GraphQLSchema;
}

const COOKIE_SECRET = getEnvironmentVariable('COOKIE_SECRET');
const NODE_ENV = getEnvironmentVariable('NODE_ENV', 'development');

export class ExpressServer implements Server {
  private readonly app: Express;
  private readonly logger: Logger;

  public constructor({ logger, schema }: ExpressServerDependencies) {
    this.logger = logger;

    const app = express();
    const executableSchema = schema.makeExecutableSchema();

    app.use(cookieParser(COOKIE_SECRET));
    app.post(
      '/graphql',
      graphqlHTTP(async (request: any, response: any) => ({
        context: await createGraphQLContext({ response, request }),
        schema: executableSchema,
      })),
    );

    if (NODE_ENV === 'development') {
      app.get('/graphql', playground({ endpoint: '/graphql' }));
    }

    this.app = app;
  }

  public async start() {
    this.app.listen({ port: 4000 }, () => {
      this.logger.info('🚀 Server listening http://localhost:4000/graphql...');
    });
  }
}
