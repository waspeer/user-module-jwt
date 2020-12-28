export type MockFrom<T extends Record<string, any>> = Record<keyof T, jest.Mock>;
