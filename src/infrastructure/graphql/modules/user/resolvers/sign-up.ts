import { SignUpCommand } from '../../../../../application/command/sign-up/sign-up-command';
import { UserCreatedEvent, UserEventTypes } from '../../../../../event/event-types';
import { UserMapper } from '../../../../mapper/user-mapper';
import { MutationResolvers } from '../../../graphql-types.gen';
import { GraphQLContext } from 'infrastructure/graphql/context';
import { GraphQLResolver } from '~lib/graphql/graphql-resolver';
import { ResolverResult, ResolverParent, ResolverArgs } from '~lib/graphql/types';

interface SignUpResolverDependencies {
  signUpCommand: SignUpCommand;
}

type ResolverFn = NonNullable<MutationResolvers['signUp']>;
type Result = ResolverResult<ResolverFn>;
type Parent = ResolverParent<ResolverFn>;
type Args = ResolverArgs<ResolverFn>;

export class SignUpResolver extends GraphQLResolver<Result, Parent, Args, GraphQLContext> {
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
