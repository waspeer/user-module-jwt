import { ValueObject } from '~lib/domain/value-object';
import { Validate } from '~lib/validate';

export class Username extends ValueObject<string> {
  public constructor(value: string) {
    Validate.string(value).minLength(1);
    super(value);
  }
}
