import { createCustomError } from '~lib/errors/error';

enum SignOutErrorTypes {
  UserNotFound = 'UserNotFound',
}

export const UserNotFoundError = createCustomError(
  SignOutErrorTypes.UserNotFound,
  () => 'Unable to sign out user: can not associate refresh token with user',
);
