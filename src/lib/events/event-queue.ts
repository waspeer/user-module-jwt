import type { Event } from './types';

export class EventQueue<T extends string> {
  private events: Event<T>[] = [];

  public add(event: Event<T>) {
    this.events.push(event);
  }

  get all() {
    return this.events;
  }
}
