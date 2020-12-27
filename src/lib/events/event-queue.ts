import type { Event } from './event';

export class EventQueue<T extends string> {
  private events: Event<T>[] = [];

  public add(event: Event<T>) {
    this.events.push(event);
  }

  get all() {
    return this.events;
  }
}
