import { Request, Response } from 'express';
import { UserDTO } from '../../domain/dto/user-dto';
import { TokenUtil } from './util/token';

export type GraphQLContext = {
  response: Response;
  request: Request;
  user: UserDTO | undefined;
};

const AUTH_HEADER_PREFIX = 'Bearer ';

async function getUserFromRequest(request: Request): Promise<UserDTO | undefined> {
  const authorizationHeader = request.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith(AUTH_HEADER_PREFIX)) {
    return undefined;
  }

  const token = authorizationHeader.replace(AUTH_HEADER_PREFIX, '');
  const decodedToken = await TokenUtil.decodeToken(token);

  if (!decodedToken) {
    return undefined;
  }

  return {
    username: decodedToken.username,
  };
}

export async function createGraphQLContext({
  response,
  request,
}: {
  response: Response;
  request: Request;
}): Promise<GraphQLContext> {
  return {
    response,
    request,
    user: await getUserFromRequest(request),
  };
}
