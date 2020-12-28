import { Username } from '../../../src/domain/value-object/username';

describe('Username', () => {
  describe('constructor', () => {
    it('should not throw an error when provided with a valid value', () => {
      const validValues = ['username', '123456'];

      validValues.forEach((value) => {
        expect(() => new Username(value)).not.toThrowError();
      });
    });

    it('should throw an error when provided with a invalid value', () => {
      const invalidValues = ['', null];

      invalidValues.forEach((value) => {
        expect(() => new Username(value as any)).toThrowError();
      });
    });

    it('should set the provided value as its value', () => {
      const value = 'username';
      const username = new Username(value);

      expect(username.value).toBe(value);
    });
  });
});
