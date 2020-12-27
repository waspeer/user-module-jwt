import type { Options } from './types';
import { StringValidator } from './validator-string';

export class Validate {
  static string(subject: string, options?: Options) {
    return new StringValidator(subject, options);
  }
}
