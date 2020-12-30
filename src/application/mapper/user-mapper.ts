import type { UserDTO } from '../../domain/dto/user-dto';
import { User } from '../../domain/entity/user';

export class UserMapper {
  static toDTO(user: User): UserDTO {
    return {
      username: user.username.value,
    };
  }
}
