/* eslint-disable no-param-reassign */
import {
  defaultFieldResolver,
  DirectiveLocation,
  GraphQLField,
  GraphQLFieldResolver,
} from 'graphql';
import { GraphQLContext } from '../context';
import { GraphQLDirective } from '~lib/graphql/types';

export class AuthDirective implements GraphQLDirective {
  public names = ['auth'];

  public typeDef = /* GraphQL */ `
    directive @auth on FIELD_DEFINITION
  `;

  public transformers = {
    [DirectiveLocation.FIELD_DEFINITION]: <TSource>(
      field: GraphQLField<TSource, GraphQLContext>,
    ) => {
      const { resolve = defaultFieldResolver } = field;
      const resolveWhenAuthenticated: GraphQLFieldResolver<TSource, GraphQLContext> = (...args) => {
        const context = args[2];

        if (!context || !context.user) {
          throw new Error('Not allowed');
        }

        return resolve.apply(this, args);
      };

      field.resolve = resolveWhenAuthenticated;
    },
  };
}
