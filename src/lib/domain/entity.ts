import { Identifier } from './identifier';

export abstract class Entity<T extends Record<string, any>> {
  public readonly id: Identifier;
  protected props: T;

  public constructor(props: T, id?: Identifier) {
    this.id = id || new Identifier();
    this.props = props;
  }

  public equals(entity: Entity<T>) {
    if (entity.constructor !== this.constructor) {
      return false;
    }

    return this.id.equals(entity.id);
  }
}
