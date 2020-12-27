import type { DomainEventEmitter } from './domain-event-emitter';
import type { Event } from './event';

interface Dependencies<T extends string> {
  domainEventEmitter: DomainEventEmitter<T>;
}

export abstract class Listener<T extends Event> {
  abstract readonly eventType: T['type'];

  private readonly domainEventEmitter: DomainEventEmitter<T['type']>;

  public constructor({ domainEventEmitter }: Dependencies<T['type']>) {
    this.domainEventEmitter = domainEventEmitter;
  }

  abstract handle(event: T): Promise<void> | void;

  public register() {
    this.domainEventEmitter.on(this.eventType, this);
  }
}
