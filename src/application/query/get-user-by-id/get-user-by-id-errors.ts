import { createCustomError } from '~lib/errors/error';

enum GetUserByIdQueryErrorTypes {
  UserNotFound = 'UserNotFound',
}

export const UserNotFoundError = createCustomError(
  GetUserByIdQueryErrorTypes.UserNotFound,
  () => 'Unable to get user by id: user not found',
);
