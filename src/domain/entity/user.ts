import { UserCreatedEvent } from '../../event/user-created-event';
import { Password } from '../value-object/password';
import { Username } from '../value-object/username';
import { UserEventTypes } from 'event/event-types';
import { AggregateRoot } from '~lib/domain/aggregate-root';

interface UserProps {
  username: Username;
  password: Password;
}

export class User extends AggregateRoot<UserProps, UserEventTypes> {
  public get username() {
    return this.props.username;
  }

  public get password() {
    return this.props.password;
  }

  protected createCreatedEvent() {
    return new UserCreatedEvent(this);
  }
}
