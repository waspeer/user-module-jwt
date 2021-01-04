/* eslint-disable no-param-reassign */
import { AuthenticationError, gql } from 'apollo-server-express';
import {
  defaultFieldResolver,
  DirectiveLocation,
  GraphQLField,
  GraphQLFieldResolver,
} from 'graphql';
import { GraphQLContext } from '../context';
import { GraphQLDirective } from '~lib/graphql/graphql-directive';

export class AuthDirective extends GraphQLDirective {
  public names = ['auth'];

  public typeDef = gql`
    directive @auth on FIELD_DEFINITION
  `;

  public directiveMap = {
    [DirectiveLocation.FIELD_DEFINITION]: <TSource>(
      field: GraphQLField<TSource, GraphQLContext>,
    ) => {
      const { resolve = defaultFieldResolver } = field;
      const resolveWhenAuthenticated: GraphQLFieldResolver<TSource, GraphQLContext> = (...args) => {
        const context = args[2];

        if (!context || !context.user) {
          throw new AuthenticationError('Not allowed');
        }

        return resolve.apply(this, args);
      };

      field.resolve = resolveWhenAuthenticated;
    },
  };
}
