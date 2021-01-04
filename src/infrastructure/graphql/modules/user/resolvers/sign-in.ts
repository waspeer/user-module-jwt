import { SignInCommand } from '../../../../../application/command/sign-in/sign-in-command';
import { UserEventTypes, UserSignedInEvent } from '../../../../../event/event-types';
import { MutationResolvers } from '../../../generated-types';
import { RefreshToken } from 'domain/entity/refresh-token';
import { GraphQLContext } from 'infrastructure/graphql/context';
import { GraphQLResolver, ResolverArgs, ResolverParent } from '~lib/graphql/graphql-resolver';
import { getEnvironmentVariable } from '~lib/helpers/get-environment-variable';

interface SignInResolverDependencies {
  signInCommand: SignInCommand;
}

type ResolverFn = NonNullable<MutationResolvers['signIn']>;
type Parent = ResolverParent<ResolverFn>;
type Args = ResolverArgs<ResolverFn>;

const NODE_ENV = getEnvironmentVariable('NODE_ENV', 'development');

export class SignInResolver extends GraphQLResolver<ResolverFn> {
  public path = ['Mutation', 'signIn'] as const;
  public signInCommand: SignInCommand;

  public constructor({ signInCommand }: SignInResolverDependencies) {
    super();
    this.signInCommand = signInCommand;
  }

  public async resolve(_parent: Parent, { input }: Args, { response, request }: GraphQLContext) {
    await this.signInCommand.execute({
      ipAddress: (request.headers['x-forwarded-for'] || request.connection.remoteAddress) as string,
      password: input.password,
      userAgent: request.get('user-agent') ?? '',
      username: input.username,
    });

    const signInEvent = this.signInCommand.findEmittedEvent<UserSignedInEvent>(
      UserEventTypes.SignedIn,
    );

    if (!signInEvent) {
      throw new Error('Unexpected error while signing in');
    }

    // TODO set name as env variable
    response.cookie('rt', signInEvent.payload.refreshToken, {
      httpOnly: true,
      maxAge: RefreshToken.LIFETIME,
      secure: NODE_ENV === 'production',
      // TODO sign cookie?
      sameSite: 'lax',
    });

    return {
      __typename: 'SignInSuccessPayload' as const,
      accessToken: signInEvent.payload.accessToken,
    };
  }
}
