import { RefreshToken } from '../../../src/domain/entity/refresh-token';
import { createDevice } from '../../util/create-device';

describe('Refresh Token', () => {
  describe('.constructor', () => {
    it('should construct with a provided expiresAt date', () => {
      const device = createDevice();
      const expiresAt = new Date('2020-12-20');
      const refreshToken = new RefreshToken({ expiresAt, device });

      expect(refreshToken.expiresAt).toEqual(expiresAt);
    });

    it('should set a default createdAt date', () => {
      // ? This might not always work (1ms difference between createdAt times), but lets try it out
      const device = createDevice();
      const refreshToken = new RefreshToken({ device });
      const expectedExpiredAt = new Date(Date.now() + RefreshToken.LIFETIME);

      expect(refreshToken.expiresAt).toEqual(expectedExpiredAt);
    });
  });

  describe('.isValid', () => {
    it('should return false when token has expired', () => {
      const device = createDevice();
      const expiresAt = new Date(Date.now() - RefreshToken.LIFETIME);
      const refreshToken = new RefreshToken({ expiresAt, device });

      expect(refreshToken.isValid).toBeFalse();
    });

    it('should return true when token has not yet expired', () => {
      const device = createDevice();
      const refreshToken = new RefreshToken({ device });

      expect(refreshToken.isValid).toBeTrue();
    });
  });

  describe('.extend', () => {
    it('should extend the lifetime of the token with the default lifetime', () => {
      const device = createDevice();
      const initialExpiresAt = new Date(Date.now() + Math.round(RefreshToken.LIFETIME / 2));
      const refreshToken = new RefreshToken({ device, expiresAt: initialExpiresAt });

      expect(refreshToken.isValid).toBeTrue();
      expect(() => refreshToken.extend()).not.toThrowError();
      expect(refreshToken.expiresAt).toBeAfter(initialExpiresAt);
    });

    it('should throw an error when the token is already expired', () => {
      const device = createDevice();
      const expiresAt = new Date(Date.now() - RefreshToken.LIFETIME);
      const refreshToken = new RefreshToken({ device, expiresAt });

      expect(refreshToken.isValid).toBeFalse();
      expect(() => refreshToken.extend()).toThrowError();
    });
  });
});
