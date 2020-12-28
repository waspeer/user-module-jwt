import { Identifier } from '../domain/identifier';

export interface Event<T extends string = string, S = any> {
  id: Identifier;
  aggregateId: Identifier;
  occurredAt: Date;
  payload: S;
  type: T;
  serializePayload(): string;
}

export interface Listener<E extends Event> {
  handle(event: E): Promise<void> | void;
}

export interface DomainEventEmitter<T extends string> {
  emit(eventOrEvents: Event<T> | Event<T>[]): void;
  on<E extends Event>(eventType: T, listener: Listener<E>): void;
}
