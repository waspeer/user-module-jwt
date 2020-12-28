# User Module JWT

This is a module for user management/authentication. This is made for educational purposes.

## Stories

-   [x] A user can be created (signed up) by providing a username and password (additional information might be added later)
-   [ ] A user can exchange its credentials (username and password) for an access token and a refresh token (sign in)
-   [ ] A user can exchange its refresh token for a new access token (refresh token)
-   [ ] A user can invalidate its refresh token (sign out)
-   [ ] The user information of the currently logged in user can be queried (get user by refresh token)


```mermaid
classDiagram

Token <|-- AccessToken
Token <|-- RefreshToken
User "1" --> "0..1" RefreshToken

class User {
  <<aggregate>>
  string username
  string password

  refreshTokens() UserTokens
  signIn() UserTokens
  signOut() void
}

class Token {
  <<abstract>>
  string value
  date expiresAt

  isValid() boolean
}
class AccessToken
class RefreshToken

class UserTokens {
  <<interface>>
  AccessToken accessToken
  RefreshToken refreshToken
}
```

```mermaid
graph LR

subgraph "Sign Up"
  su1["Sign Up"]:::command -->
  su2["Validate input"]:::policy -- "valid" -->
  su3["UserCreated"]:::event
end

subgraph "Sign In (refresh token exists)"
  sr1["Sign In"]:::command -->
  sr2["Check if user already has refresh token"]:::policy -- "yes" -->
  sr3["Create new access token + update expiry of refresh token"]:::policy -->
  sr4["UserTokenRefreshed"]:::event
end

subgraph "Sign In (no refresh token)"
  s1["Sign In"]:::command -->
  s2["Check if user already has refresh token"]:::policy -- "no" -->
  s3["Create new access token + refresh token"]:::policy -->
  s4["UserSignedIn"]:::event
end

subgraph "Refresh Token"
  r1["Refresh Token"]:::command -->
  r2["Check if provided refresh token is valid"]:::policy -- "valid" -->
  r3["Create new access token + update expiry of refresh token"]:::policy -->
  r4["UserTokenRefreshed"]:::event
end

subgraph "Sign Out"
  so1["Sign Out"]:::command -->
  so2["Check if provided refresh token is valid"]:::policy -- "valid" -->
  so3["UserSignedOut"]:::event
end

classDef command fill:steelblue
classDef event fill:gold,color:black
classDef policy fill:pink,color:black
```
