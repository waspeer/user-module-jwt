import { DomainError } from './domain-error';

export function assert(predicate: any, message: string): asserts predicate {
  if (!predicate) {
    throw new DomainError(message);
  }
}
