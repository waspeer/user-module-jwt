import { GraphQLError } from './graphql-error';
import { GraphQLResolver as IGraphQLResolver } from './types';
import { AnyObject } from '~lib/helpers/helper-types';

export abstract class GraphQLResolver<
  TResult,
  TParent extends AnyObject,
  TArgs extends AnyObject,
  TContext extends AnyObject
> implements IGraphQLResolver<TResult, TParent, TArgs, TContext> {
  public abstract path: Readonly<[string, string]>;

  /**
   * Creates a new GraphQLResolver and automagically wraps the `.resolve` function so that all errors are passed to `.handleError`
   */
  public constructor() {
    this.resolve = this.wrapResolveMethod(this.resolve);
  }

  /**
   * Determines how errors are sent to the client. It maps the error to an `GraphQLError` class by default.
   * Should be overridden for default behavior.
   */
  // eslint-disable-next-line class-methods-use-this
  public handleError(error: Error): TResult {
    return new GraphQLError(error) as any;
  }

  public abstract resolve(parent: TParent, args: TArgs, context: TContext): Promise<TResult>;

  /**
   * Catches all the errors that are thrown in the `.resolve` method and passes them to `.handleError`
   */
  private wrapResolveMethod<
    R extends GraphQLResolver<TResult, TParent, TArgs, TContext>['resolve']
  >(resolveMethod: R) {
    return async (...args: Parameters<R>) => {
      try {
        const result = await resolveMethod.apply(this, args);

        return result;
      } catch (error) {
        return this.handleError(error);
      }
    };
  }
}
