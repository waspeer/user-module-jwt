import { Username } from 'domain/value-object/username';

export class UsernameAlreadyTakenError extends Error {
  constructor(username: Username) {
    super(`Username '${username.value}' is already taken`);
  }
}
