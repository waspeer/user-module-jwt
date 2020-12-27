import { Error } from '../errors/error';

export class ValidationError extends Error {
  public constructor(message: string) {
    super(message, ValidationError);
  }
}
