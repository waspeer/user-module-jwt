import { UnexpectedError } from '~lib/errors/unexpected-error';

export class GraphQLError {
  public readonly __typename: string;
  public readonly message: string;

  public constructor(error: Error) {
    if (error.name === 'Error') {
      throw new UnexpectedError(error);
    }

    this.__typename = error.name;
    this.message = error.message;
  }
}
