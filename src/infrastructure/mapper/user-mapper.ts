import { Prisma, User as PrismaUser } from '@prisma/client';
import type { UserDTO } from '../../domain/dto/user-dto';
import { RefreshToken } from '../../domain/entity/refresh-token';
import { User } from '../../domain/entity/user';
import { Password } from '../../domain/value-object/password';
import { Username } from '../../domain/value-object/username';
import { Identifier } from '~lib/domain/identifier';

export class UserMapper {
  static toDomain(user: PrismaUser, refreshTokens: RefreshToken[]): User {
    return new User(
      {
        password: new Password(user.password, { isHashed: true }),
        username: new Username(user.username),
        refreshTokens,
      },
      new Identifier(user.id),
    );
  }

  static toDTO(user: User): UserDTO {
    return {
      username: user.username.value,
    };
  }

  static toPersistence(user: User): Prisma.UserCreateInput {
    return {
      id: user.id.value,
      password: user.password.value,
      username: user.username.value,
    };
  }
}
