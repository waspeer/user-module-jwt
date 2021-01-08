import type { RefreshToken } from '../../domain/entity/refresh-token';
import type { User } from '../../domain/entity/user';
import type { Identifier } from '~lib/domain/identifier';

export interface RefreshTokenRepository {
  findAssociatedUserIdById(identifier: Identifier): Promise<Identifier | undefined>;
  getRefreshTokensByUserId(identifier: Identifier): Promise<RefreshToken[]>;
  storeRefreshTokensForUser(user: User): Promise<void>;
}
