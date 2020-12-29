import { UserSignedInEvent } from '../../../src/event/user-signed-in-event';
import { createDevice } from '../../util/create-device';
import { createRefreshToken } from '../../util/create-refresh-token';
import { createUser } from '../../util/create-user';

describe('User', () => {
  describe('.signIn', () => {
    it('should throw an error when the provided password does not match', () => {
      const device = createDevice();
      const user = createUser({ password: 'password' });
      const password = 'other-password';

      expect(() => user.signIn({ password, device })).toThrowError();
    });

    it('should create a refresh token if one is not already present', () => {
      const device = createDevice();
      const password = 'password';
      const user = createUser({ password });

      expect(user.refreshTokens).toBeEmpty();
      expect(() => user.signIn({ password, device })).not.toThrowError();
      expect(user.refreshTokens).not.toBeEmpty();
      expect(user.events.all).toIncludeAllMembers([expect.any(UserSignedInEvent)]);
    });

    it('should extend a token when it matches to provided device instead of creating a new one', () => {
      const device = createDevice();
      const existingRefreshToken = createRefreshToken({ device });
      const password = 'password';
      const user = createUser({ password, refreshTokens: [existingRefreshToken] });

      expect(user.refreshTokens).toHaveLength(1);
      expect(() => user.signIn({ password, device })).not.toThrowError();
      expect(user.refreshTokens).toHaveLength(1);
      expect(user.events.all).toIncludeAllMembers([expect.any(UserSignedInEvent)]);
    });
  });

  describe('.createAccessToken', () => {
    it('should create a new access token', () => {
      const refreshToken = createRefreshToken();
      const user = createUser({ refreshTokens: [refreshToken] });
      const { device } = refreshToken;

      expect(() => user.createAccessTokenForDevice(device)).not.toThrowError();
    });

    it('should throw an error when there is no refreshToken associated with the device', () => {
      const device = createDevice();
      const user = createUser();

      expect(() => user.createAccessTokenForDevice(device)).toThrowError();
    });
  });
});
