import {
  DirectiveLocation,
  GraphQLField,
  GraphQLResolveInfo,
  GraphQLSchema as Schema,
} from 'graphql';
import { AnyObject } from '~lib/helpers/helper-types';

///
// UTILITY
///

/** The object that contains all the dependencies that need to be injected for the schema */
type Cradle = any;

///
// DIRECTIVE
///

export interface SchemaTransformer<T> {
  (config: T, args: AnyObject): T | void;
}

export interface TransformerMap {
  [DirectiveLocation.FIELD_DEFINITION]: SchemaTransformer<GraphQLField<any, any>>;
  // Can easily be extended in the future
  // https://www.graphql-tools.com/docs/schema-directives#full-mapschema-api
}

export interface GraphQLDirective {
  /** The names this directive has in the schema */
  names: string[];

  /** The typeDef needed to add this directive to the schema */
  typeDef: string;

  /** The schema transformers that implement the directive */
  transformers: Partial<TransformerMap>;
}

export interface GraphQLDirectiveClass {
  new (cradle: Cradle): GraphQLDirective;
}

///
// RESOLVER
///

/**
 * A resolver function. This interface should be compatible with those generated with https://graphql-code-generator.com
 * Make sure the option `noSchemaStitching` is set to true.
 */
export type ResolverFunction<
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

/** Infers the result of a ResolverFunction */
export type ResolverResult<R extends ResolverFunction> = R extends ResolverFunction<
  infer T,
  any,
  any,
  any
>
  ? T
  : unknown;

/** Infers the parent parameter of a ResolverFunction */
export type ResolverParent<R extends ResolverFunction> = R extends ResolverFunction<
  any,
  infer T,
  any,
  any
>
  ? T
  : unknown;

/** Infers the context parameter of a ResolverFunction */
export type ResolverContext<R extends ResolverFunction> = R extends ResolverFunction<
  any,
  any,
  infer T,
  any
>
  ? T
  : unknown;

/** Infers the args parameter of a ResolverFunction */
export type ResolverArgs<R extends ResolverFunction> = R extends ResolverFunction<
  any,
  any,
  any,
  infer T
>
  ? T
  : unknown;

export interface GraphQLResolver<
  TResult = unknown,
  TParent extends AnyObject = any,
  TArgs extends AnyObject = any,
  TContext extends AnyObject = any
> {
  /**
   * The path of the resolver (`[rootType, fieldName]`)
   * eg. `['Query', 'allPosts']`)
   */
  path: Readonly<[string, string]>;

  /**
   * The implementation of the Resolver
   */
  resolve(parent: TParent, args: TArgs, context: TContext): Promise<TResult> | TResult;
}

export interface GraphQLResolverClass {
  new (cradle: Cradle): GraphQLResolver<any>;
}

///
// MODULE
///

export interface GraphQLModule {
  typeDefs: string[];
  resolvers: GraphQLResolverClass[];
}

///
// SCHEMA
///

export interface GraphQLSchema {
  baseTypeDefs: string;
  directives: GraphQLDirectiveClass[];
  modules: GraphQLModule[];

  makeExecutableSchema(): Schema;
}
