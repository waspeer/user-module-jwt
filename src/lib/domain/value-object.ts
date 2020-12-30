/**
 * Value Object Class
 * Represents an immutable value
 *
 * @template V - Type of the value
 */
export abstract class ValueObject<V> {
  protected readonly _value: V;

  public constructor(value: V) {
    this._value = value;
  }

  public get value() {
    return this._value;
  }

  public equals(value: ValueObject<V>) {
    if (value.constructor !== this.constructor) {
      return false;
    }

    return this._value === value.value;
  }
}
