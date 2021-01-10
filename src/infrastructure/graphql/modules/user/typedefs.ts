export const userTypeDefs = /* GraphQL */ `
  # SHARED
  type User {
    username: String!
  }

  # ERRORS
  type DomainError implements Error {
    message: String!
  }

  type InvalidRefreshTokenError implements Error {
    message: String!
  }

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

  union RefreshAccessTokenPayload =
      RefreshAccessTokenSuccessPayload
    | DomainError
    | InvalidRefreshTokenError

  # SIGN IN
  input SignInInput {
    password: String!
    username: String!
  }

  type SignInSuccessPayload {
    accessToken: String!
  }

  union SignInPayload = SignInSuccessPayload | DomainError | UserNotFoundError

  # SIGN OUT
  type SignOutSuccessPayload {
    _empty: String
  }

  union SignOutPayload = SignOutSuccessPayload | DomainError | UserNotFoundError

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
    refreshAccessToken: RefreshAccessTokenPayload! @auth
    signIn(input: SignInInput!): SignInPayload!
    signOut: SignOutPayload!
    signUp(input: SignUpInput!): SignUpPayload!
  }

  extend type Query {
    me: User @auth
  }
`;
