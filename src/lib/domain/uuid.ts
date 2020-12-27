import { v4 as uuidv4 } from 'uuid';

/**
 * UUID class
 */
export class UUID {
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
    this.value = id || uuidv4();
  }

  /**
   * Determines if the passed UUID is the equal to this UUID
   *
   * @param {UUID} id
   * @returns {boolean}
   */
  public equals(id: UUID) {
    if (!(id instanceof UUID)) {
      return false;
    }

    return id.value === this.value;
  }
}
