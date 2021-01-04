import { SignUpCommand } from '../../../../../application/command/sign-up/sign-up-command';
import { UserMapper } from '../../../../../application/mapper/user-mapper';
import { UserCreatedEvent, UserEventTypes } from '../../../../../event/event-types';
import { MutationResolvers } from '../../../generated-types';
import { GraphQLResolver, ResolverArgs, ResolverParent } from '~lib/graphql/graphql-resolver';

interface SignUpResolverDependencies {
  signUpCommand: SignUpCommand;
}

type ResolverFn = NonNullable<MutationResolvers['signUp']>;
type Parent = ResolverParent<ResolverFn>;
type Args = ResolverArgs<ResolverFn>;

export class SignUpResolver extends GraphQLResolver<ResolverFn> {
  public path = ['Mutation', 'signUp'] as const;
  private readonly signUpCommand: SignUpCommand;

  public constructor({ signUpCommand }: SignUpResolverDependencies) {
    super();
    this.signUpCommand = signUpCommand;
  }

  public async resolve(_parent: Parent, { input }: Args) {
    await this.signUpCommand.execute(input);

    const createdEvent = this.signUpCommand.findEmittedEvent<UserCreatedEvent>(
      UserEventTypes.Created,
    );

    if (!createdEvent) {
      throw new Error('Unexpected error while signing up');
    }

    return {
      __typename: 'SignUpSuccessPayload' as const,
      user: UserMapper.toDTO(createdEvent.payload.user),
    };
  }
}
