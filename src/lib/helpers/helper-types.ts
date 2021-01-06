export type AnyObject = Record<string, unknown>;

export type PickPartial<T, K extends keyof T> = Partial<Pick<T, K>> & Omit<T, K>;
