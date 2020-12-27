export interface DIContainer {
  get<T>(name: string): T;
}
