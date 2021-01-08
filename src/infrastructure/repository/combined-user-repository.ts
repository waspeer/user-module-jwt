import { Prisma, PrismaClient, User as PrismaUser } from '@prisma/client';
import { RefreshToken } from '../../domain/entity/refresh-token';
import { User } from '../../domain/entity/user';
import { UserRepository } from '../../domain/repository/user-repository';
import { Password } from '../../domain/value-object/password';
import { Username } from '../../domain/value-object/username';
import type { RefreshTokenRepository } from './types';
import { Identifier } from '~lib/domain/identifier';

interface CombinedUserRepositoryDependencies {
  refreshTokenRepository: RefreshTokenRepository;
}

const prisma = new PrismaClient();

export class CombinedUserRepository implements UserRepository {
  private readonly refreshTokenRepository: RefreshTokenRepository;

  public constructor({ refreshTokenRepository }: CombinedUserRepositoryDependencies) {
    this.refreshTokenRepository = refreshTokenRepository;
  }

  public async findByRefreshTokenId(identifier: Identifier) {
    const userIdentifier = await this.refreshTokenRepository.findAssociatedUserIdById(identifier);

    if (!userIdentifier) {
      return undefined;
    }

    const userData = await prisma.user.findUnique({ where: { id: userIdentifier.value } });

    if (!userData) {
      return undefined;
    }

    const userId = new Identifier(userData.id);
    const refreshTokens = await this.refreshTokenRepository.getRefreshTokensByUserId(userId);

    return this.mapUserToDomain(userData, refreshTokens);
  }

  public async findByUsername(username: Username) {
    const userData = await prisma.user.findUnique({ where: { username: username.value } });

    if (!userData) {
      return undefined;
    }

    const userId = new Identifier(userData.id);
    const refreshTokens = await this.refreshTokenRepository.getRefreshTokensByUserId(userId);

    return this.mapUserToDomain(userData, refreshTokens);
  }

  public async store(user: User) {
    const userData = this.mapUserToPersistence(user);

    await prisma.user.upsert({
      create: userData,
      update: userData,
      where: { id: user.id.value },
    });

    await this.refreshTokenRepository.storeRefreshTokensForUser(user);
  }

  ///
  // MAPPERS
  ///

  private mapUserToDomain(user: PrismaUser, refreshTokens: RefreshToken[]): User {
    return new User(
      {
        password: new Password(user.password, { isHashed: true }),
        username: new Username(user.username),
        refreshTokens,
      },
      new Identifier(user.id),
    );
  }

  private mapUserToPersistence(user: User): Prisma.UserCreateInput {
    return {
      id: user.id.value,
      password: user.password.value,
      username: user.username.value,
    };
  }
}
