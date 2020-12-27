import { UUID } from './uuid';

export abstract class Entity<T extends Record<string, any>> {
  public readonly id: UUID;
  protected props: T;

  constructor(props: T, id?: UUID) {
    this.id = id || new UUID();
    this.props = props;
  }
}
