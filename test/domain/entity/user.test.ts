import { RefreshToken } from '../../../src/domain/entity/refresh-token';
import { IpAddress } from '../../../src/domain/value-object/ip-address';
import { UserAccessTokenRefreshedEvent } from '../../../src/event/user-access-token-refreshed-event';
import { UserSignedInEvent } from '../../../src/event/user-signed-in-event';
import { UserSignedOutEvent } from '../../../src/event/user-signed-out-event';
import { createRefreshToken } from '../../util/create-refresh-token';
import { createUser } from '../../util/create-user';
import { Identifier } from '~lib/domain/identifier';
import { DomainError } from '~lib/errors/domain-error';

describe('User', () => {
  describe('.refreshAccessToken', () => {
    it('should create an AccessToken and extend RefreshToken', () => {
      const initialRefreshTokenExpireDate = new Date(Date.now() + RefreshToken.LIFETIME / 2);
      const refreshToken = createRefreshToken({ expiresAt: initialRefreshTokenExpireDate });
      const user = createUser({ refreshTokens: [refreshToken] });

      expect(() =>
        user.refreshAccessToken({
          ipAddress: refreshToken.ipAddress,
          refreshTokenId: refreshToken.id,
        }),
      ).not.toThrowError();
      expect(refreshToken.expiresAt).toBeAfter(initialRefreshTokenExpireDate);
      expect(user.events.all).toIncludeAllMembers([expect.any(UserAccessTokenRefreshedEvent)]);
    });

    it('should throw an error when no RefreshToken is found on the user', () => {
      const user = createUser({ refreshTokens: [] });
      const ipAddress = new IpAddress('98.139.180.149');
      const refreshTokenId = new Identifier();

      expect(() => user.refreshAccessToken({ ipAddress, refreshTokenId })).toThrow(DomainError);
    });

    it('should throw an error when the IpAddress does not match the one associated with the RefreshToken', () => {
      const refreshToken = createRefreshToken({ ipAddress: '98.139.180.149' });
      const user = createUser({ refreshTokens: [refreshToken] });
      const wrongIpAddress = new IpAddress('69.89.31.226');

      expect(() =>
        user.refreshAccessToken({
          ipAddress: wrongIpAddress,
          refreshTokenId: refreshToken.id,
        }),
      ).toThrow(DomainError);
    });
  });

  describe('.signIn', () => {
    it('should throw an error when the provided password does not match', () => {
      const user = createUser({ password: 'password' });
      const refreshToken = createRefreshToken();
      const password = 'other-password';

      expect(() =>
        user.signIn({
          password,
          ipAddress: refreshToken.ipAddress,
          userAgent: refreshToken.userAgent,
        }),
      ).toThrow(DomainError);
    });

    it('should create a refresh token if one is not already present', () => {
      const password = 'password';
      const user = createUser({ password });
      const refreshToken = createRefreshToken();

      expect(user.refreshTokens).toBeEmpty();
      expect(() =>
        user.signIn({
          password,
          ipAddress: refreshToken.ipAddress,
          userAgent: refreshToken.userAgent,
        }),
      ).not.toThrowError();
      expect(user.refreshTokens).not.toBeEmpty();
      expect(user.events.all).toIncludeAllMembers([expect.any(UserSignedInEvent)]);
    });

    it('should extend a token when it matches to provided device instead of creating a new one', () => {
      const existingRefreshToken = createRefreshToken();
      const password = 'password';
      const user = createUser({ password, refreshTokens: [existingRefreshToken] });

      expect(user.refreshTokens).toHaveLength(1);
      expect(() =>
        user.signIn({
          password,
          ipAddress: existingRefreshToken.ipAddress,
          userAgent: existingRefreshToken.userAgent,
        }),
      ).not.toThrowError();
      expect(user.refreshTokens).toHaveLength(1);
      expect(user.events.all).toIncludeAllMembers([expect.any(UserSignedInEvent)]);
    });
  });

  describe('.signOut', () => {
    it('should remove the appropriate refresh token from the user', () => {
      const refreshTokenToInvalidate = createRefreshToken();
      const otherRefreshToken = createRefreshToken();
      const user = createUser({ refreshTokens: [refreshTokenToInvalidate, otherRefreshToken] });

      expect(user.refreshTokens).toContain(refreshTokenToInvalidate);
      expect(user.refreshTokens).toContain(otherRefreshToken);

      expect(() =>
        user.signOut({
          refreshTokenId: refreshTokenToInvalidate.id,
        }),
      ).not.toThrowError();

      expect(user.refreshTokens).not.toContain(refreshTokenToInvalidate);
      expect(user.refreshTokens).toContain(otherRefreshToken);
      expect(user.events.all).toIncludeAllMembers([expect.any(UserSignedOutEvent)]);
    });

    it('should throw an error when the refreshtoken can not be found', () => {
      const refreshTokenToInvalidate = createRefreshToken();
      const user = createUser();

      expect(() =>
        user.signOut({
          refreshTokenId: refreshTokenToInvalidate.id,
        }),
      ).toThrow(DomainError);
    });
  });
});
