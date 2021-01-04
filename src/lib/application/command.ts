import { Command as ICommand } from './types';
import { AggregateRoot } from '~lib/domain/aggregate-root';
import { DomainEventEmitter, Event } from '~lib/events/types';

interface CommandDependencies<E extends string> {
  domainEventEmitter: DomainEventEmitter<E>;
}

/**
 * Command Base Class
 * Ensures that void is returned and exposes utility functions for events created during command
 *
 * @template E - The possible event types
 * @template A - The arguments that need to be provided to the execute method
 */
export abstract class Command<E extends string, A extends Record<string, unknown>>
  implements ICommand<A> {
  private readonly domainEventEmitter: DomainEventEmitter<E>;
  private emittedEvents: Event<E>[] = [];

  public constructor({ domainEventEmitter }: CommandDependencies<E>) {
    this.domainEventEmitter = domainEventEmitter;
  }

  /**
   * Find the last occurence of an event with the specified type.
   * Only the events that were emitted during the last execution of the command can be searched.
   *
   * @param type - The event type
   */
  public findEmittedEvent<T extends Event<E>>(type: T extends Event<infer S> ? S : E) {
    return [...this.emittedEvents].reverse().find((event) => event.type === type) as T | undefined;
  }

  public abstract execute(args: A): Promise<void>;

  /**
   * Emits the accumulated events of an aggregate. Should be called at the end of the command-logic.
   *
   * @param aggregate - The aggregate of which the accumulated events should be dispatched
   */
  protected emitEvents(aggregate: AggregateRoot<any, E>) {
    this.domainEventEmitter.emit(aggregate.events.all);
    this.emittedEvents = aggregate.events.all;
  }
}
