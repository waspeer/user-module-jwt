export class GraphQLError {
  public readonly __typename: string;
  public readonly message: string;

  public constructor(error: Error) {
    this.__typename = error.name;
    this.message = error.message;
  }
}
