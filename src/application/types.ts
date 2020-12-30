import { UserEventTypes } from '../event/event-types';
import { Command } from '~lib/application/command';

export abstract class UserCommand<A extends Record<string, any>> extends Command<
  UserEventTypes,
  A
> {}
