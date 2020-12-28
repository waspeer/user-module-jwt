import { EventQueue } from '../events/event-queue';
import type { Event } from '../events/types';
import { Entity } from './entity';
import { Identifier } from './identifier';

/**
 * Aggregate root
 *
 * @template T - Aggregate properties
 * @template E - Event types
 */
export abstract class AggregateRoot<
  T extends Record<string, any>,
  E extends string = string
> extends Entity<T> {
  protected createCreatedEvent?(): Event<E>;

  public readonly events = new EventQueue<E>();

  public constructor(props: T, id?: Identifier) {
    super(props, id);

    if (!id && this.createCreatedEvent) {
      this.events.add(this.createCreatedEvent());
    }
  }
}
