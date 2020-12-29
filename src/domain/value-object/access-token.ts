import jwt from 'jsonwebtoken';
import type { User } from '../entity/user';
import { ValueObject } from '~lib/domain/value-object';
import { getEnvironmentVariable } from '~lib/helpers/get-environment-variable';

interface AccessTokenConstructorProps {
  user: User;
}

const PRIVATE_KEY = getEnvironmentVariable('JWT_PRIVATE_KEY').replace(/\\n/g, '\n');
const FIFTEEN_MINUTES = 15 * 60 * 1000;

export class AccessToken extends ValueObject<string> {
  public static ALGORITHM = 'ES256' as const;
  public static LIFETIME = FIFTEEN_MINUTES;

  public readonly expiresAt: Date;

  // TODO should be included in the token at some point
  // public static AUDIENCE = getEnvironmentVariable('JWT_AUD');
  // public static ISSUER = getEnvironmentVariable('JWT_ISS');

  public constructor({ user }: AccessTokenConstructorProps) {
    const expiresAt = new Date(Date.now() + AccessToken.LIFETIME);
    const token = jwt.sign(
      {
        exp: Math.floor(expiresAt.getTime() / 1000),
        subject: user.id.value,
        username: user.username.value,
      },
      PRIVATE_KEY,
      { algorithm: AccessToken.ALGORITHM },
    );

    super(token);
    this.expiresAt = expiresAt;
  }

  public get isValid() {
    return this.expiresAt.getTime() > Date.now();
  }
}
