import { User } from 'domain/entity/user';
import { Username } from 'domain/value-object/username';

export interface UserRepository {
  findByUsername(username: Username): Promise<User | undefined>;
  store(user: User): Promise<void>;
}
