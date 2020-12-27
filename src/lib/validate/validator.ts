import type { AnySchema } from 'yup';
import type { Options } from './types';
import { ValidationError } from './validation-error';

export abstract class Validator<T> {
  constructor(public readonly subject: T, protected options: Options = {}) {}

  protected validateSchema(schema: AnySchema<T | undefined>) {
    try {
      schema.validateSync(this.subject);
    } catch (error) {
      let message: string;

      if (!error?.message) {
        message = 'input is not valid';
      } else {
        message = error.message.replace('this', this.options.name || 'input');
      }

      throw new ValidationError(message);
    }
  }
}
