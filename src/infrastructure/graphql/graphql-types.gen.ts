import { GraphQLResolveInfo } from 'graphql';
import { GraphQLContext } from './context';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } &
  { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type User = {
  __typename?: 'User';
  username: Scalars['String'];
};

export type UsernameAlreadyTakenError = Error & {
  __typename?: 'UsernameAlreadyTakenError';
  message: Scalars['String'];
};

export type UserNotFoundError = Error & {
  __typename?: 'UserNotFoundError';
  message: Scalars['String'];
};

export type RefreshAccessTokenSuccessPayload = {
  __typename?: 'RefreshAccessTokenSuccessPayload';
  accessToken: Scalars['String'];
};

export type RefreshAccessTokenPayload = RefreshAccessTokenSuccessPayload | UserNotFoundError;

export type SignInInput = {
  password: Scalars['String'];
  username: Scalars['String'];
};

export type SignInSuccessPayload = {
  __typename?: 'SignInSuccessPayload';
  accessToken: Scalars['String'];
};

export type SignInPayload = SignInSuccessPayload | UserNotFoundError;

export type SignOutSuccessPayload = {
  __typename?: 'SignOutSuccessPayload';
  _empty?: Maybe<Scalars['String']>;
};

export type SignOutPayload = SignOutSuccessPayload | UserNotFoundError;

export type SignUpInput = {
  username: Scalars['String'];
  password: Scalars['String'];
};

export type SignUpSuccessPayload = {
  __typename?: 'SignUpSuccessPayload';
  user?: Maybe<User>;
};

export type SignUpPayload = SignUpSuccessPayload | UsernameAlreadyTakenError;

export type Mutation = {
  __typename?: 'Mutation';
  refreshAccessToken: RefreshAccessTokenPayload;
  signIn: SignInPayload;
  signOut: SignOutPayload;
  signUp: SignUpPayload;
};

export type MutationSignInArgs = {
  input: SignInInput;
};

export type MutationSignUpArgs = {
  input: SignUpInput;
};

export type Query = {
  __typename?: 'Query';
  me?: Maybe<User>;
};

export type Error = {
  message: Scalars['String'];
};

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<
  TResult,
  TParent,
  TContext,
  TArgs
>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo,
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo,
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  User: ResolverTypeWrapper<User>;
  String: ResolverTypeWrapper<Scalars['String']>;
  UsernameAlreadyTakenError: ResolverTypeWrapper<UsernameAlreadyTakenError>;
  UserNotFoundError: ResolverTypeWrapper<UserNotFoundError>;
  RefreshAccessTokenSuccessPayload: ResolverTypeWrapper<RefreshAccessTokenSuccessPayload>;
  RefreshAccessTokenPayload:
    | ResolversTypes['RefreshAccessTokenSuccessPayload']
    | ResolversTypes['UserNotFoundError'];
  SignInInput: SignInInput;
  SignInSuccessPayload: ResolverTypeWrapper<SignInSuccessPayload>;
  SignInPayload: ResolversTypes['SignInSuccessPayload'] | ResolversTypes['UserNotFoundError'];
  SignOutSuccessPayload: ResolverTypeWrapper<SignOutSuccessPayload>;
  SignOutPayload: ResolversTypes['SignOutSuccessPayload'] | ResolversTypes['UserNotFoundError'];
  SignUpInput: SignUpInput;
  SignUpSuccessPayload: ResolverTypeWrapper<SignUpSuccessPayload>;
  SignUpPayload:
    | ResolversTypes['SignUpSuccessPayload']
    | ResolversTypes['UsernameAlreadyTakenError'];
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  Error: ResolversTypes['UsernameAlreadyTakenError'] | ResolversTypes['UserNotFoundError'];
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  User: User;
  String: Scalars['String'];
  UsernameAlreadyTakenError: UsernameAlreadyTakenError;
  UserNotFoundError: UserNotFoundError;
  RefreshAccessTokenSuccessPayload: RefreshAccessTokenSuccessPayload;
  RefreshAccessTokenPayload:
    | ResolversParentTypes['RefreshAccessTokenSuccessPayload']
    | ResolversParentTypes['UserNotFoundError'];
  SignInInput: SignInInput;
  SignInSuccessPayload: SignInSuccessPayload;
  SignInPayload:
    | ResolversParentTypes['SignInSuccessPayload']
    | ResolversParentTypes['UserNotFoundError'];
  SignOutSuccessPayload: SignOutSuccessPayload;
  SignOutPayload:
    | ResolversParentTypes['SignOutSuccessPayload']
    | ResolversParentTypes['UserNotFoundError'];
  SignUpInput: SignUpInput;
  SignUpSuccessPayload: SignUpSuccessPayload;
  SignUpPayload:
    | ResolversParentTypes['SignUpSuccessPayload']
    | ResolversParentTypes['UsernameAlreadyTakenError'];
  Mutation: {};
  Query: {};
  Error:
    | ResolversParentTypes['UsernameAlreadyTakenError']
    | ResolversParentTypes['UserNotFoundError'];
  Boolean: Scalars['Boolean'];
};

export type UserResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']
> = {
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UsernameAlreadyTakenErrorResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes['UsernameAlreadyTakenError'] = ResolversParentTypes['UsernameAlreadyTakenError']
> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserNotFoundErrorResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes['UserNotFoundError'] = ResolversParentTypes['UserNotFoundError']
> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RefreshAccessTokenSuccessPayloadResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes['RefreshAccessTokenSuccessPayload'] = ResolversParentTypes['RefreshAccessTokenSuccessPayload']
> = {
  accessToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RefreshAccessTokenPayloadResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes['RefreshAccessTokenPayload'] = ResolversParentTypes['RefreshAccessTokenPayload']
> = {
  __resolveType: TypeResolveFn<
    'RefreshAccessTokenSuccessPayload' | 'UserNotFoundError',
    ParentType,
    ContextType
  >;
};

export type SignInSuccessPayloadResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes['SignInSuccessPayload'] = ResolversParentTypes['SignInSuccessPayload']
> = {
  accessToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SignInPayloadResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes['SignInPayload'] = ResolversParentTypes['SignInPayload']
> = {
  __resolveType: TypeResolveFn<
    'SignInSuccessPayload' | 'UserNotFoundError',
    ParentType,
    ContextType
  >;
};

export type SignOutSuccessPayloadResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes['SignOutSuccessPayload'] = ResolversParentTypes['SignOutSuccessPayload']
> = {
  _empty?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SignOutPayloadResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes['SignOutPayload'] = ResolversParentTypes['SignOutPayload']
> = {
  __resolveType: TypeResolveFn<
    'SignOutSuccessPayload' | 'UserNotFoundError',
    ParentType,
    ContextType
  >;
};

export type SignUpSuccessPayloadResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes['SignUpSuccessPayload'] = ResolversParentTypes['SignUpSuccessPayload']
> = {
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SignUpPayloadResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes['SignUpPayload'] = ResolversParentTypes['SignUpPayload']
> = {
  __resolveType: TypeResolveFn<
    'SignUpSuccessPayload' | 'UsernameAlreadyTakenError',
    ParentType,
    ContextType
  >;
};

export type MutationResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']
> = {
  refreshAccessToken?: Resolver<
    ResolversTypes['RefreshAccessTokenPayload'],
    ParentType,
    ContextType
  >;
  signIn?: Resolver<
    ResolversTypes['SignInPayload'],
    ParentType,
    ContextType,
    RequireFields<MutationSignInArgs, 'input'>
  >;
  signOut?: Resolver<ResolversTypes['SignOutPayload'], ParentType, ContextType>;
  signUp?: Resolver<
    ResolversTypes['SignUpPayload'],
    ParentType,
    ContextType,
    RequireFields<MutationSignUpArgs, 'input'>
  >;
};

export type QueryResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']
> = {
  me?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
};

export type ErrorResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes['Error'] = ResolversParentTypes['Error']
> = {
  __resolveType: TypeResolveFn<
    'UsernameAlreadyTakenError' | 'UserNotFoundError',
    ParentType,
    ContextType
  >;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type Resolvers<ContextType = GraphQLContext> = {
  User?: UserResolvers<ContextType>;
  UsernameAlreadyTakenError?: UsernameAlreadyTakenErrorResolvers<ContextType>;
  UserNotFoundError?: UserNotFoundErrorResolvers<ContextType>;
  RefreshAccessTokenSuccessPayload?: RefreshAccessTokenSuccessPayloadResolvers<ContextType>;
  RefreshAccessTokenPayload?: RefreshAccessTokenPayloadResolvers<ContextType>;
  SignInSuccessPayload?: SignInSuccessPayloadResolvers<ContextType>;
  SignInPayload?: SignInPayloadResolvers<ContextType>;
  SignOutSuccessPayload?: SignOutSuccessPayloadResolvers<ContextType>;
  SignOutPayload?: SignOutPayloadResolvers<ContextType>;
  SignUpSuccessPayload?: SignUpSuccessPayloadResolvers<ContextType>;
  SignUpPayload?: SignUpPayloadResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Error?: ErrorResolvers<ContextType>;
};

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = GraphQLContext> = Resolvers<ContextType>;
