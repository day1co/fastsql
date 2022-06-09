import type { QueryOptions } from 'mysql';

// https://github.com/mysqljs/mysql#performing-queries
export function MYSQL(strings: ReadonlyArray<string>, ...values: Array<unknown>): QueryOptions {
  const result = { sql: '', values: Array<unknown>() };
  for (let i = 0, len = values.length; i < len; i += 1) {
    const value = values[i];
    result.sql += strings[i];
    switch (typeof value) {
      case 'symbol':
        result.sql += '??';
        result.values.push(Symbol.keyFor(value) as string);
        break;
      case 'function':
        result.sql += (value as Function)();
        break;
      default:
        result.sql += '?';
        result.values.push(value);
        break;
    }
  }
  return result;
}
