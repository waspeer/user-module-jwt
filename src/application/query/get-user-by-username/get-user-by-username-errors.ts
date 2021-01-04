import { createCustomError } from '~lib/errors/error';

enum GetUserByUsernameQueryErrorTypes {
  UserNotFound = 'UserNotFoundError',
}

export const UserNotFoundError = createCustomError(
  GetUserByUsernameQueryErrorTypes.UserNotFound,
  () => 'Unable to get user by username: user not found',
);
