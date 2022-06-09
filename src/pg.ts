import type { QueryConfig } from 'pg';
import { encodeIdentifier } from './sql';

// https://node-postgres.com/features/queries
export function PG(strings: ReadonlyArray<string>, ...values: Array<unknown>): QueryConfig {
  const result = { text: '', values: Array<unknown>() };
  for (let i = 0, len = values.length, paramIndex = 0; i < len; i += 1) {
    const value = values[i];
    result.text += strings[i];
    switch (typeof value) {
      case 'symbol':
        // PG didn't support parameterized identifier
        result.text += encodeIdentifier(Symbol.keyFor(value as symbol) as string);
        break;
      case 'function':
        result.text += (value as Function)();
        break;
      default:
        paramIndex += 1;
        result.text += '$' + paramIndex;
        result.values.push(value);
        break;
    }
  }
  return result;
}
