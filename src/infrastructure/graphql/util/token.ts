import jwt from 'jsonwebtoken';
import { AccessToken } from '../../../domain/value-object/access-token';
import { getEnvironmentVariable } from '~lib/helpers/get-environment-variable';

interface DecodedToken {
  exp: number;
  subject: string;
  username: string;
  iat: number;
}

const JWT_PUBLIC_KEY = getEnvironmentVariable('JWT_PUBLIC_KEY').replace(/\\n/g, '\n');

export class TokenUtil {
  public static async decodeToken(token: string) {
    const decodedToken = await new Promise<DecodedToken | undefined>((resolve) => {
      jwt.verify(
        token,
        JWT_PUBLIC_KEY,
        { algorithms: [AccessToken.ALGORITHM] },
        (_error, claims) => {
          resolve(claims as any);
        },
      );
    });

    return decodedToken;
  }
}
