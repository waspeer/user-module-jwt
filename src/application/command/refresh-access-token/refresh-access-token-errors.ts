import { createCustomError } from '~lib/errors/error';

enum RefreshAccessTokenErrorTypes {
  InvalidRefreshToken = 'InvalidRefreshTokenError',
}

export const InvalidRefreshTokenError = createCustomError(
  RefreshAccessTokenErrorTypes.InvalidRefreshToken,
  () => 'Unable to refresh access token: cannot associate refresh token with user',
);
