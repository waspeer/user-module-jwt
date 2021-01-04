import type { GraphQLResolveInfo } from 'graphql';
import { GraphQLError } from './graphql-error';

type AnyObject = Record<string, unknown>;

/**
 * A resolver function. This interface should be compatible with those generated with https://graphql-code-generator.com
 * Make sure the option `noSchemaStitching` is set to true
 */
export type Resolver<
  TResult = unknown,
  TParent extends AnyObject = any,
  TContext extends AnyObject = any,
  TArgs extends AnyObject = any
> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => Promise<TResult> | TResult;

export type ResolverResult<R extends Resolver> = R extends Resolver<infer T, any, any, any>
  ? T
  : unknown;
export type ResolverParent<R extends Resolver> = R extends Resolver<any, infer T, any, any>
  ? T
  : unknown;
export type ResolverContext<R extends Resolver> = R extends Resolver<any, any, infer T, any>
  ? T
  : unknown;
export type ResolverArgs<R extends Resolver> = R extends Resolver<any, any, any, infer T>
  ? T
  : unknown;

/**
 * GraphQLResolver base class
 */
export abstract class GraphQLResolver<T extends Resolver> {
  /**
   * The path of the resolver (`[rootType, fieldName]`, eg. `['Query', 'allPosts']`)
   */
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
  public handleError(error: Error): ResolverResult<T> {
    return new GraphQLError(error) as any;
  }

  public makeResolverObject() {
    const [rootType, fieldName] = this.path;

    return {
      [rootType]: {
        [fieldName]: this.resolve.bind(this),
      },
    };
  }

  public abstract resolve(
    parent: ResolverParent<T>,
    args: ResolverArgs<T>,
    context: ResolverContext<T>,
  ): Promise<ResolverResult<T>>;

  /**
   * Catches all the errors that are thrown in the `.resolve` method and passes them to `.handleError`
   */
  private wrapResolveMethod<R extends GraphQLResolver<T>['resolve']>(resolveMethod: R) {
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
