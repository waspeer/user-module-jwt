import bcrypt from 'bcrypt';
import { ValueObject } from '~lib/domain/value-object';
import { Validate } from '~lib/validate';

interface PasswordOptions {
  isHashed?: boolean;
}

const SALT_ROUNDS = 12;

export class Password extends ValueObject<string> {
  public constructor(value: string, { isHashed = false }: PasswordOptions = {}) {
    if (isHashed) {
      super(value);
      return this;
    }

    Validate.string(value, { name: 'password' }).minLength(1);
    super(bcrypt.hashSync(value, SALT_ROUNDS));
  }

  // @ts-expect-error: This is the only way encrypted passwords can be compared
  public equals(password: string) {
    return bcrypt.compareSync(password, this._value);
  }
}
