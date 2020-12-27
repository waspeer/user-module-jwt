import { Validate } from '../validate';

describe('StringValidator', () => {
  describe('.minLength', () => {
    it('should return a successful result when subject is valid', () => {
      const validate = () => Validate.string('ramses').minLength(2);
      expect(validate).not.toThrowError();
    });

    it('should return a failed result when subject is not valid', () => {
      const validate = () => Validate.string('ramses').minLength(10);
      expect(validate).toThrowError();
    });
  });

  describe('.maxLength', () => {
    it('should return a successful result when subject is valid', () => {
      const validate = () => Validate.string('ramses').maxLength(10);
      expect(validate).not.toThrowError();
    });

    it('should return a failed result when subject is not valid', () => {
      const validate = () => Validate.string('ramses').maxLength(2);
      expect(validate).toThrowError();
    });
  });

  describe('.email', () => {
    it('should return a successful result when subject is valid', () => {
      const validate = () => Validate.string('ramses.boomboom@gmail.com').email();
      expect(validate).not.toThrowError();
    });

    it('should return a failed result when subject is invalid', () => {
      const validate = () => Validate.string('ramses.boomboom-gmail.com').email();
      expect(validate).toThrowError();
    });
  });
});
