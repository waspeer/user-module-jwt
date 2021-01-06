import { ExecutableSchemaTransformation, makeExecutableSchema } from '@graphql-tools/schema';
import { getDirectives, IResolvers, MapperKind, mapSchema } from '@graphql-tools/utils';
import { DirectiveLocation, GraphQLSchema as Schema } from 'graphql';
import {
  GraphQLDirectiveClass,
  GraphQLModule,
  GraphQLSchema as IGraphQLSchema,
  TransformerMap,
} from './types';
import { AnyObject } from '~lib/helpers/helper-types';

const directiveLocationToMapperKindMap: Record<keyof TransformerMap, MapperKind> = {
  [DirectiveLocation.FIELD_DEFINITION]: MapperKind.FIELD,
};

export abstract class GraphQLSchema implements IGraphQLSchema {
  public directives: GraphQLDirectiveClass[] = [];
  public abstract modules: GraphQLModule[];

  /**
   * The base typeDefs. Should at least include a Query and Mutation root type.
   */
  public baseTypeDefs = /* GraphQL */ `
    type Query
    type Mutation
  `;

  public constructor(private readonly cradle: AnyObject) {}

  /**
   * Returns a executable GraphQL schema that can be used to start a GraphQL server
   */
  public makeExecutableSchema() {
    const typeDefs: string[] = [this.baseTypeDefs];
    const resolvers: IResolvers[] = [];
    const schemaTransforms: ExecutableSchemaTransformation[] = [];

    this.directives.forEach((Directive) => {
      const directive = new Directive(this.cradle);
      const transformerEntries = Object.entries(directive.transformers);

      typeDefs.push(directive.typeDef);
      schemaTransforms.push(
        ...directive.names.map((name) => (schema: Schema) =>
          mapSchema(
            schema,
            Object.fromEntries(
              transformerEntries.map(([directiveLocation, schemaTransformer]) => [
                directiveLocationToMapperKindMap[directiveLocation as keyof TransformerMap],
                (node: any) => {
                  const directives = getDirectives(schema, node);
                  const args = directives[name];

                  if (args && schemaTransformer) {
                    return schemaTransformer(node, args);
                  }

                  return node;
                },
              ]),
            ),
          ),
        ),
      );
    });

    this.modules.forEach((mod) => {
      typeDefs.push(...mod.typeDefs);
      resolvers.push(
        ...mod.resolvers.map((Resolver) => {
          const resolver = new Resolver(this.cradle);
          const [rootType, fieldName] = resolver.path;
          const resolverFunction = resolver.resolve.bind(resolver);

          return { [rootType]: { [fieldName]: resolverFunction } };
        }),
      );
    });

    return makeExecutableSchema({
      schemaTransforms,
      resolvers,
      resolverValidationOptions: {
        requireResolversForResolveType: 'ignore',
      },
      typeDefs,
    });
  }
}
