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
      return encodeIdentifier(Symbol.keyFor(value as symbol) as string);
    case 'function':
      return encodeRaw((value as Function)());
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
      return '"' + literal.replaceAll('"', '\\"') + '"';
    case 'function':
      return (literal as Function)();
    case 'number':
      if (Number.isNaN(literal) || !Number.isFinite(literal)) {
        return 'NULL';
      }
      return String(literal);
    case 'boolean':
      return literal ? 'TRUE' : 'FALSE';
    default:
      if (literal === null || literal === undefined) {
        return 'NULL';
      }
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

export function encodeRaw(raw: string): string {
  return raw;
}

export const TABLE = encodeIdentifier;
export const COLUMN = encodeIdentifier;
export const RAW = encodeRaw;
