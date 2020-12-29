import jwt from 'jsonwebtoken';
import { AccessToken } from '../../../src/domain/value-object/access-token';
import { createUser } from '../../util/create-user';
import { getEnvironmentVariable } from '~lib/helpers/get-environment-variable';

const ALGORITHM = 'ES256';
const PUBLIC_KEY = getEnvironmentVariable('JWT_PUBLIC_KEY').replace(/\\n/g, '\n');

describe('Access Token', () => {
  it('should create a valid jwt for the provided user', async () => {
    const user = createUser();
    const accessToken = new AccessToken({ user });

    expect(() =>
      jwt.verify(accessToken.value, PUBLIC_KEY, {
        algorithms: [ALGORITHM],
      }),
    ).not.toThrowError();

    const claims = jwt.decode(accessToken.value);

    expect(claims).toContainEntries([
      ['subject', user.id.value],
      ['username', user.username.value],
    ]);
  });
});
