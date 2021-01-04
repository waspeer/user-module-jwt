/* eslint-disable max-classes-per-file */
import {
  gql,
  IResolvers,
  makeExecutableSchema,
  SchemaDirectiveVisitor,
} from 'apollo-server-express';
import {
  DirectiveLocation,
  DirectiveLocation,
  DirectiveLocation,
  DirectiveLocationEnum,
  DocumentNode,
} from 'graphql';
import { DirectiveMap, GraphQLDirective } from './graphql-directive';
import type { GraphQLModule } from './graphql-module';

type Cradle = Record<string, unknown>;

interface GraphQLDirectiveClass {
  new (): GraphQLDirective;
}

interface GraphQLModuleClass {
  new (): GraphQLModule;
}

export abstract class GraphQLSchema {
  public directives: Record<string, GraphQLDirectiveClass>[] = [];
  public abstract modules: Record<string, GraphQLModuleClass>[];

  public baseTypeDefs = gql`
    type Query
    type Mutation
  `;

  public constructor(private readonly cradle: Cradle) {}

  public makeExecutableSchema() {
    const typeDefs: DocumentNode[] = [this.baseTypeDefs];
    const resolvers: IResolvers[] = [];
    const directives = this.directives.flatMap((directiveRecord) => Object.values(directiveRecord));
    const directiveConfigEntries: [string, typeof SchemaDirectiveVisitor][] = [];
    const modules = this.modules.flatMap((moduleRecord) => Object.values(moduleRecord));

    directives.forEach((Directive) => {
      const directive = new Directive();

      directiveConfigEntries.push(...this.mapDirectiveToApolloConfigEntries(directive));
      typeDefs.push(directive.typeDef);
    });

    modules.forEach((Module) => {
      const module = new Module();
      const moduleResolvers = module.resolvers.flatMap((resolverRecord) =>
        Object.values(resolverRecord),
      );

      typeDefs.push(...module.typeDefs);
      resolvers.push(
        ...moduleResolvers.map((Resolver) => {
          const resolver = new Resolver(this.cradle);
          return resolver.makeResolverObject();
        }),
      );
    });

    return makeExecutableSchema({
      resolvers,
      resolverValidationOptions: {
        requireResolversForResolveType: false,
      },
      schemaDirectives: Object.fromEntries(directiveConfigEntries),
      typeDefs,
    });
  }

  // eslint-disable-next-line class-methods-use-this
  private mapDirectiveToApolloConfigEntries(directive: GraphQLDirective) {
    const ApolloClass = class extends SchemaDirectiveVisitor {
      public visitSchema(...args: Parameters<SchemaDirectiveVisitor['visitSchema']>) {
        const method = directive.directiveMap[DirectiveLocation.SCHEMA];

        if (method) {
          return method(...args);
        }

        return super.visitSchema(...args);
      }

      public visitScalar(...args: Parameters<SchemaDirectiveVisitor['visitScalar']>) {
        const method = directive.directiveMap[DirectiveLocation.SCALAR];

        if (method) {
          return method(...args);
        }

        return super.visitScalar(...args);
      }

      public visitObject(...args: Parameters<SchemaDirectiveVisitor['visitObject']>) {
        const method = directive.directiveMap[DirectiveLocation.OBJECT];

        if (method) {
          return method(...args);
        }

        return super.visitObject(...args);
      }

      public visitFieldDefinition(
        ...args: Parameters<SchemaDirectiveVisitor['visitFieldDefinition']>
      ) {
        const method = directive.directiveMap[DirectiveLocation.FIELD_DEFINITION];

        if (method) {
          return method(args[0]);
        }

        return super.visitFieldDefinition(...args);
      }

      public visitArgumentDefinition(
        ...args: Parameters<SchemaDirectiveVisitor['visitArgumentDefinition']>
      ) {
        const method = directive.directiveMap[DirectiveLocation.ARGUMENT_DEFINITION];

        if (method) {
          return method(args[0]);
        }

        return super.visitArgumentDefinition(...args);
      }

      public visitInterface(...args: Parameters<SchemaDirectiveVisitor['visitInterface']>) {
        const method = directive.directiveMap[DirectiveLocation.INTERFACE];

        if (method) {
          return method(...args);
        }

        return super.visitInterface(...args);
      }

      public visitUnion(...args: Parameters<SchemaDirectiveVisitor['visitUnion']>) {
        const method = directive.directiveMap[DirectiveLocation.UNION];

        if (method) {
          return method(...args);
        }

        return super.visitUnion(...args);
      }

      public visitEnum(...args: Parameters<SchemaDirectiveVisitor['visitEnum']>) {
        const method = directive.directiveMap[DirectiveLocation.ENUM];

        if (method) {
          return method(...args);
        }

        return super.visitEnum(...args);
      }

      public visitEnumValue(...args: Parameters<SchemaDirectiveVisitor['visitEnumValue']>) {
        const method = directive.directiveMap[DirectiveLocation.ENUM_VALUE];

        if (method) {
          return method(args[0]);
        }

        return super.visitEnumValue(...args);
      }

      public visitInputObject(...args: Parameters<SchemaDirectiveVisitor['visitInputObject']>) {
        const method = directive.directiveMap[DirectiveLocation.INPUT_OBJECT];

        if (method) {
          return method(...args);
        }

        return super.visitInputObject(...args);
      }

      public visitInputFieldDefinition(
        ...args: Parameters<SchemaDirectiveVisitor['visitInputFieldDefinition']>
      ) {
        const method = directive.directiveMap[DirectiveLocation.INPUT_FIELD_DEFINITION];

        if (method) {
          return method(args[0]);
        }

        return super.visitInputFieldDefinition(...args);
      }
    };

    return directive.names.map((name) => [name, ApolloClass] as [string, typeof ApolloClass]);
  }
}
