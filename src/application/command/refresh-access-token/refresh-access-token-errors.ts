import { createCustomError } from '~lib/errors/error';

enum RefreshAccessTokenErrorTypes {
  UserNotFound = 'UserNotFoundError',
}

export const UserNotFoundError = createCustomError(
  RefreshAccessTokenErrorTypes.UserNotFound,
  () => 'Unable to refresh access token: cannot associate refresh token with user',
);
