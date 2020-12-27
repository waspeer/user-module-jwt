import { Validate } from '../validate';

describe('Validate', () => {
  it('should be chainable', () => {
    const attempt1 = () => Validate.string('ramses').minLength(2).maxLength(10);
    expect(attempt1).not.toThrowError();

    const attempt2 = () => Validate.string('ramses').minLength(2).maxLength(3);
    expect(attempt2).toThrowError();

    const attempt3 = () => Validate.string('ramses').minLength(10).maxLength(15);
    expect(attempt3).toThrowError();
  });

  it('should be able to name the subject', () => {
    const name = 'ramses';
    const validate = () => Validate.string('ramses', { name }).minLength(10);
    expect(validate).toThrowError(
      expect.objectContaining({ message: expect.stringContaining(name) }),
    );
  });
});
