import { gql } from 'apollo-server-express';

export const userTypeDefs = gql`
  # SHARED
  type User {
    username: String!
  }

  # ERRORS
  type UsernameAlreadyTakenError implements Error {
    message: String!
  }

  type UserNotFoundError implements Error {
    message: String!
  }

  # REFRESH ACCESS TOKEN
  type RefreshAccessTokenSuccessPayload {
    accessToken: String!
  }

  union RefreshAccessTokenPayload = RefreshAccessTokenSuccessPayload | UserNotFoundError

  # SIGN IN
  input SignInInput {
    password: String!
    username: String!
  }

  type SignInSuccessPayload {
    accessToken: String!
  }

  union SignInPayload = SignInSuccessPayload | UserNotFoundError

  # SIGN OUT
  type SignOutSuccessPayload {
    _empty: String
  }

  union SignOutPayload = SignOutSuccessPayload | UserNotFoundError

  # SIGN UP
  input SignUpInput {
    username: String!
    password: String!
  }

  type SignUpSuccessPayload {
    user: User
  }

  union SignUpPayload = SignUpSuccessPayload | UsernameAlreadyTakenError

  # ROOT TYPES
  extend type Mutation {
    refreshAccessToken: RefreshAccessTokenPayload!
    signIn(input: SignInInput!): SignInPayload!
    signOut: SignOutPayload!
    signUp(input: SignUpInput!): SignUpPayload!
  }

  extend type Query {
    me: User @auth
  }
`;
