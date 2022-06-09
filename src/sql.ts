export function SQL(strings: ReadonlyArray<string>, ...values: Array<unknown>): string {
  let result = '';
  for (let i = 0, len = values.length; i < len; i += 1) {
    result += strings[i];
    result += encodeValue(values[i]);
  }
  result += strings[strings.length - 1];
  return result;
}

export function encodeValue(value: unknown): string {
  switch (typeof value) {
    case 'symbol':
      try {
        const identifier = Symbol.keyFor(value as symbol) as string;
        return encodeIdentifier(identifier);
      } catch (e: unknown) {
        throw new TypeError(`invalid identifier symbol: ${String(value)}`);
      }
    case 'function':
      try {
        return (value as Function)();
      } catch (e: unknown) {
        throw new TypeError(`invalid raw value: ${String(value)}`);
      }
    default:
      return encodeLiteral(value);
  }
}

export function encodeIdentifier(identifier: string): string {
  return '`' + identifier + '`';
}

export function encodeLiteral(literal: unknown): string {
  switch (typeof literal) {
    case 'string':
      return '"' + literal.replace('"', '""') + '"';
    case 'function':
      return (literal as Function)();
    case 'number':
      return String(literal);
    default:
      if (Array.isArray(literal)) {
        return '(' + (literal as Array<unknown>).map(encodeLiteral).join(',') + ')';
      }
      if (literal instanceof Date) {
        const s = literal.toISOString();
        return `"${s.substring(0, 10)} ${s.substring(11, 19)}"`;
      }
      throw new TypeError(`unsupported literal type: ${typeof literal}`);
  }
}
