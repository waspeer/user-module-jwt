export interface Event<T extends string = string, S = any> {
  aggregateId: string;
  createdAt: Date;
  payload: S;
  type: T;
}
