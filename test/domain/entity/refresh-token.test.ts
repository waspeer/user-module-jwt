import faker from 'faker';
import { RefreshToken } from '../../../src/domain/entity/refresh-token';
import { IpAddress } from '../../../src/domain/value-object/ip-address';
import { UserAgent } from '../../../src/domain/value-object/user-agent';

describe('Refresh Token', () => {
  describe('.constructor', () => {
    it('should construct with a provided expiresAt date', () => {
      const expiresAt = new Date('2020-12-20');
      const refreshToken = new RefreshToken({
        expiresAt,
        ipAddress: new IpAddress(faker.internet.ip()),
        userAgent: new UserAgent(faker.internet.userAgent()),
      });

      expect(refreshToken.expiresAt).toEqual(expiresAt);
    });

    it('should set a default createdAt date', () => {
      // ? This might not always work (1ms difference between createdAt times), but lets try it out
      const refreshToken = new RefreshToken({
        ipAddress: new IpAddress(faker.internet.ip()),
        userAgent: new UserAgent(faker.internet.userAgent()),
      });
      const expectedExpiredAt = new Date(Date.now() + RefreshToken.LIFETIME);

      expect(refreshToken.expiresAt).toEqual(expectedExpiredAt);
    });
  });

  describe('.isValid', () => {
    it('should return false when token has expired', () => {
      const expiresAt = new Date(Date.now() - RefreshToken.LIFETIME);
      const refreshToken = new RefreshToken({
        expiresAt,
        ipAddress: new IpAddress(faker.internet.ip()),
        userAgent: new UserAgent(faker.internet.userAgent()),
      });

      expect(refreshToken.isValid).toBeFalse();
    });

    it('should return true when token has not yet expired', () => {
      const refreshToken = new RefreshToken({
        ipAddress: new IpAddress(faker.internet.ip()),
        userAgent: new UserAgent(faker.internet.userAgent()),
      });

      expect(refreshToken.isValid).toBeTrue();
    });
  });

  describe('.extend', () => {
    it('should extend the lifetime of the token with the default lifetime', () => {
      const initialExpiresAt = new Date(Date.now() + Math.round(RefreshToken.LIFETIME / 2));
      const refreshToken = new RefreshToken({
        expiresAt: initialExpiresAt,
        ipAddress: new IpAddress(faker.internet.ip()),
        userAgent: new UserAgent(faker.internet.userAgent()),
      });

      expect(refreshToken.isValid).toBeTrue();
      expect(() => refreshToken.extend()).not.toThrowError();
      expect(refreshToken.expiresAt).toBeAfter(initialExpiresAt);
    });

    it('should throw an error when the token is already expired', () => {
      const expiresAt = new Date(Date.now() - RefreshToken.LIFETIME);
      const refreshToken = new RefreshToken({
        expiresAt,
        ipAddress: new IpAddress(faker.internet.ip()),
        userAgent: new UserAgent(faker.internet.userAgent()),
      });

      expect(refreshToken.isValid).toBeFalse();
      expect(() => refreshToken.extend()).toThrowError();
    });
  });
});
