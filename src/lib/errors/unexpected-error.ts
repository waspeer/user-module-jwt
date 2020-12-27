import { Error } from './error';

export class UnexpectedError extends Error {
  constructor(error: Error) {
    super(
      `An unexpected error occurred.${
        process.env.NODE_ENV === 'production' ? '' : ` The error was: ${error.message}`
      }`,
      UnexpectedError,
    );
  }
}
