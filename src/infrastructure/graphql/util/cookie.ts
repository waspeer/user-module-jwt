import { Request, Response } from 'express';
import { RefreshToken } from '../../../domain/entity/refresh-token';
import { getEnvironmentVariable } from '~lib/helpers/get-environment-variable';

const NODE_ENV = getEnvironmentVariable('NODE_ENV', 'development');
const RT_COOKIE_NAME = 'rt';

export class CookieUtil {
  public static clearRefreshTokenCookie(response: Response) {
    response.clearCookie(RT_COOKIE_NAME);
  }

  public static getRefreshTokenCookie(request: Request) {
    return request.signedCookies[RT_COOKIE_NAME] as string;
  }

  public static setRefreshTokenCookie(response: Response, refreshToken: string) {
    response.cookie(RT_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      maxAge: RefreshToken.LIFETIME,
      secure: NODE_ENV === 'production',
      signed: true,
      sameSite: 'lax',
    });
  }
}
