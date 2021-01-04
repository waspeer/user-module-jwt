import { ApolloServerExpressConfig } from 'apollo-server-express';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserDTO } from 'domain/dto/user-dto';
import { getEnvironmentVariable } from '~lib/helpers/get-environment-variable';

export interface GraphQLContext {
  response: Response;
  request: Request;
  user: UserDTO | undefined;
}

interface DecodedToken {
  exp: number;
  subject: string;
  username: string;
  iat: number;
}

const AUTH_HEADER_PREFIX = 'Bearer ';
const JWT_PUBLIC_KEY = getEnvironmentVariable('JWT_PUBLIC_KEY').replace(/\\n/g, '\n');

// TODO refactor token logic to seperate utilities
async function getUserFromRequest(request: Request): Promise<UserDTO | undefined> {
  const authorizationHeader = request.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith(AUTH_HEADER_PREFIX)) {
    return undefined;
  }

  const [, token] = authorizationHeader.split(AUTH_HEADER_PREFIX);
  const decodedToken = await new Promise<DecodedToken | undefined>((resolve) => {
    jwt.verify(token, JWT_PUBLIC_KEY, (_error, claims) => {
      resolve(claims as any);
    });
  });

  if (!decodedToken) {
    return undefined;
  }

  return {
    username: decodedToken.username,
  };
}

export const createGraphQLContext: ApolloServerExpressConfig['context'] = async ({
  res,
  req,
}): Promise<GraphQLContext> => ({
  response: res,
  request: req,
  user: await getUserFromRequest(req),
});
