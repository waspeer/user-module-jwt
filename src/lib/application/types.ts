/**
 * Feature
 * Common interface between a query and a command
 *
 * @template S - The type of the argument object for the execute method
 * @template T - The return type of the execute method
 */
interface Feature<S extends Record<string, any>, T> {
  execute: (args: S) => Promise<T>;
}

/**
 * Command
 * Commands change state and return void
 *
 * @template S - The type of the argument object for the execute method
 */
export type Command<S extends Record<string, any>> = Feature<S, void>;

/**
 * Query
 * Queries have no side effects an return a DTO
 *
 * @template S - The type of the argument object for the execute method
 */
export type Query<S extends Record<string, any>, T extends Record<string, any>> = Feature<S, T>;
