import * as yup from 'yup';

import { Validator } from './validator';

export class StringValidator extends Validator<string> {
  protected schema = yup.string().required();

  email() {
    this.validateSchema(this.schema.email());

    return this;
  }

  maxLength(limit: number) {
    this.validateSchema(this.schema.max(limit));

    return this;
  }

  minLength(limit: number) {
    this.validateSchema(this.schema.min(limit));

    return this;
  }
}
