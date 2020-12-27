import assert from 'assert';

const cache: Record<string, string> = {};

export function getEnvironmentVariable(name: string, fallback?: string): string {
  if (cache[name]) {
    return cache[name];
  }

  const variable = process.env[name] ?? fallback;

  assert(variable, `Unable to retrieve ${name} from environment variables`);

  cache[name] = variable;

  return variable;
}
