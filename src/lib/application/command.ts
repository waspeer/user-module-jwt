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
  private readonly emittedEvents: Event<E>[] = [];

  public constructor({ domainEventEmitter }: CommandDependencies<E>) {
    this.domainEventEmitter = domainEventEmitter;
  }

  public findEmittedEvent(type: E) {
    return this.emittedEvents.find((event) => event.type === type);
  }

  public abstract execute(args: A): Promise<void>;

  protected emitEvents(aggregate: AggregateRoot<any, E>) {
    this.domainEventEmitter.emit(aggregate.events.all);
    this.emittedEvents.push(...aggregate.events.all);
  }
}
