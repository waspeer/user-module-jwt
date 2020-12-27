import { Identifier } from './identifier';

export abstract class Entity<T extends Record<string, any>> {
  public readonly id: Identifier;
  protected props: T;

  constructor(props: T, id?: Identifier) {
    this.id = id || new Identifier();
    this.props = props;
  }
}
