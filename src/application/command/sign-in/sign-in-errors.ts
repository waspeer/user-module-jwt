import type { Username } from '../../../domain/value-object/username';
import { createCustomError } from '~lib/errors/error';

enum SignInErrorTypes {
  UserNotFound = 'UserNotFoundError',
}

export const UserNotFoundError = createCustomError(
  SignInErrorTypes.UserNotFound,
  (username: Username) => `Unable to sign in: user with username '${username.value}' not found`,
);
