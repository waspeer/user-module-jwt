import { Identifier } from '../domain/identifier';
import type { Event as IEvent } from './types';
import type { AggregateRoot } from '~lib/domain/aggregate-root';

interface EventProps<T extends string, P extends any> {
  aggregate: AggregateRoot<any>;
  payload: P;
  type: T;
}

export abstract class Event<
  E extends IEvent,
  T extends string = E extends IEvent<infer T> ? T : string,
  P = E extends IEvent<string, infer P> ? P : any
> implements IEvent {
  public readonly id: Identifier;
  public readonly aggregateId: Identifier;
  public readonly occurredAt: Date;
  public readonly payload: P;
  public readonly type: T;

  public constructor({ aggregate, payload, type }: EventProps<T, P>) {
    this.id = new Identifier();
    this.aggregateId = aggregate.id;
    this.occurredAt = new Date();
    this.payload = payload;
    this.type = type;
  }

  public serializePayload(): string {
    return JSON.stringify(this.payload);
  }
}
