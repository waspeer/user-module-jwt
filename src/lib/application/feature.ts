/**
 * @template S - The type of the argument object for the execute method
 * @template T - The return type of the execute method
 */
export interface Feature<S extends Record<string, any>, T> {
  execute: (args: S) => Promise<T>;
}
