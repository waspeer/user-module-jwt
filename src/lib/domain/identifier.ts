import { nanoid } from 'nanoid';

/**
 * UUID class
 */
export class Identifier {
  readonly value: string;

  /**
   * Create a UUID
   *
   * The ID is stored in the immutable `value` property. It can represent an
   * existing ID (by passing the ID string) or create a new one (by ommiting
   * the ID string).
   *
   * @param {[string]} id - The ID
   */
  constructor(id?: string) {
    this.value = id || nanoid();
  }

  /**
   * Determines if the passed UUID is the equal to this UUID
   *
   * @param {Identifier} id
   * @returns {boolean}
   */
  public equals(id: Identifier) {
    if (!(id instanceof Identifier)) {
      return false;
    }

    return id.value === this.value;
  }
}
