import { Username } from '../../../domain/value-object/username';
import { createCustomError } from '~lib/errors/error';

enum SignUpErrorTypes {
  UsernameAlreadyTaken = 'UsernameAlreadyTakenError',
}

export const UsernameAlreadyTakenError = createCustomError(
  SignUpErrorTypes.UsernameAlreadyTaken,
  (username: Username) => `Unable to sign up: username '${username.value}' is already taken`,
);
