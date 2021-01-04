import {
  DirectiveLocation,
  DocumentNode,
  GraphQLArgument,
  GraphQLEnumType,
  GraphQLEnumValue,
  GraphQLField,
  GraphQLInputField,
  GraphQLInputObjectType,
  GraphQLInterfaceType,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLSchema,
  GraphQLUnionType,
} from 'graphql';

export interface DirectiveMap {
  [DirectiveLocation.SCHEMA]: (schema: GraphQLSchema) => void;
  [DirectiveLocation.SCALAR]: (scalar: GraphQLScalarType) => void;
  [DirectiveLocation.OBJECT]: (object: GraphQLObjectType) => void;
  [DirectiveLocation.FIELD_DEFINITION]: (fieldDefinition: GraphQLField<any, any>) => void;
  [DirectiveLocation.ARGUMENT_DEFINITION]: (argumentDefinition: GraphQLArgument) => void;
  [DirectiveLocation.INTERFACE]: (iface: GraphQLInterfaceType) => void;
  [DirectiveLocation.UNION]: (union: GraphQLUnionType) => void;
  [DirectiveLocation.ENUM]: (value: GraphQLEnumType) => void;
  [DirectiveLocation.ENUM_VALUE]: (enumValue: GraphQLEnumValue) => void;
  [DirectiveLocation.INPUT_OBJECT]: (inputObject: GraphQLInputObjectType) => void;
  [DirectiveLocation.INPUT_FIELD_DEFINITION]: (inputFieldDefinition: GraphQLInputField) => void;
}

export abstract class GraphQLDirective {
  public abstract names: string[];
  public abstract typeDef: DocumentNode;
  public abstract directiveMap: Partial<DirectiveMap>;
}
