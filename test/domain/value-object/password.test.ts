import bcrypt from 'bcrypt';
import { Password } from '../../../src/domain/value-object/password';
import { DomainError } from '~lib/errors/domain-error';

describe('Password', () => {
  describe('plaintext value', () => {
    it('should create an instance when provided with a valid value', () => {
      const validValues = ['password', '123456'];

      validValues.forEach((value) => {
        expect(() => new Password(value)).not.toThrowError();
      });
    });

    it('should throw an error when provided with an invalid value', () => {
      const invalidValues = ['', null];

      invalidValues.forEach((value) => {
        expect(() => new Password(value as any)).toThrow(DomainError);
      });
    });

    it('should hash the password provided', async () => {
      const plaintext = 'password';
      const password = new Password(plaintext);

      expect(password.value).not.toBe(plaintext);
      expect(bcrypt.compare(plaintext, password.value)).resolves.toBe(true);
    });
  });

  describe('hashed value', () => {
    it('should set the hashed string as its value', () => {
      const hashed = 'hashed';
      const password = new Password(hashed, { isHashed: true });

      expect(password.value).toBe(hashed);
    });
  });

  describe('.equals', () => {
    it('should compare a plaintext value with the hashed value', () => {
      const plaintext = 'plaintext';
      const otherValue = 'other-value';
      const password = new Password(plaintext);

      expect(password.equals(plaintext)).toBe(true);
      expect(password.equals(otherValue)).toBe(false);
    });
  });
});
