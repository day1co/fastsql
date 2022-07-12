import { SQL, encodeValue, encodeIdentifier, encodeLiteral } from './sql';

describe('sql', () => {
  describe('SQL', () => {
    it('should escape identifier for symbol', () => {
      const TEST = Symbol.for('hello');
      expect(SQL`${TEST}`).toBe('`hello`');
    });
    it('should bypass raw string for function', () => {
      const TEST = () => 'CURRENT_TIMESTAMP';
      expect(SQL`${TEST}`).toBe('CURRENT_TIMESTAMP');
    });
    it('should escape literal for string', () => {
      const TEST = 'hello';
      expect(SQL`${TEST}`).toBe('"hello"');
    });
    it('should escape literal for number', () => {
      const TEST = 123;
      expect(SQL`${TEST}`).toBe('123');
    });
    it('should escape literal for Date', () => {
      const TEST = new Date('1973-06-12T12:34:56.789Z');
      expect(SQL`${TEST}`).toBe('"1973-06-12 12:34:56"');
    });
    it('should escape literals for array', () => {
      const TEST = ['foo', 'bar', 'baz', 'qux'];
      expect(SQL`${TEST}`).toEqual('("foo","bar","baz","qux")');
    });
    it('should not mixed type in a literal array', () => {
      const TEST = ['foo', 123, Symbol.for('baz'), () => 'qux'];
      expect(() => {
        SQL`${TEST}`;
      }).toThrow();
    });
    it('should work with symbol, function, string, number and date', () => {
      const table = Symbol.for('table');
      const fn = () => 'CURRENT_TIMESTAMP';
      const name = 'name';
      const age = 50;
      const birth = new Date('1973-06-12T12:34:56.789Z');
      expect(SQL`SELECT * FROM ${table} WHERE fn=${fn} AND name=${name} AND age=${age} AND birth=${birth}`).toBe(
        'SELECT * FROM `table` WHERE fn=CURRENT_TIMESTAMP AND name="name" AND age=50 AND birth="1973-06-12 12:34:56"'
      );
    });
    it('should work with array for "in" operator', () => {
      const table = Symbol.for('table');
      const fn = () => 'CURRENT_TIMESTAMP';
      const name = ['foo', 'bar', 'baz', 'qux'];
      const age = [10, 20, 30];
      const birth = [new Date('1973-06-12T12:34:56.789Z'), new Date('1983-06-12T12:34:56.789Z'), fn];
      expect(SQL`SELECT * FROM ${table} WHERE name in ${name} AND age in ${age} AND birth in ${birth}`).toBe(
        'SELECT * FROM `table` WHERE name in ("foo","bar","baz","qux") AND age in (10,20,30) AND birth in ("1973-06-12 12:34:56","1983-06-12 12:34:56",CURRENT_TIMESTAMP)'
      );
    });
  });
  describe('encodeValue', () => {
    it('should convert symbol to identifier string', () => {
      expect(encodeValue(Symbol.for('hello'))).toBe('`hello`');
    });
    it('should convert function to raw string', () => {
      expect(encodeValue(() => 'CURRENT_TIMESTAMP')).toBe('CURRENT_TIMESTAMP');
    });
    it('should convert others to literal string', () => {
      expect(encodeLiteral(null)).toBe('NULL');
      expect(encodeLiteral(undefined)).toBe('NULL');
      expect(encodeLiteral(Number.NaN)).toBe('NULL');
      expect(encodeLiteral(Number.POSITIVE_INFINITY)).toBe('NULL');
      expect(encodeLiteral(Number.NEGATIVE_INFINITY)).toBe('NULL');
      expect(encodeLiteral('hello')).toBe('"hello"');
      expect(encodeLiteral('he"llo')).toBe('"he\\"llo"');
      expect(encodeLiteral('he""llo')).toBe('"he\\"\\"llo"');
      expect(encodeLiteral('')).toBe('""');
      expect(encodeValue(123)).toBe('123');
      expect(encodeValue(123.456)).toBe('123.456');
      expect(encodeValue(true)).toBe('TRUE');
      expect(encodeValue(false)).toBe('FALSE');
      expect(encodeLiteral(new Date('1973-06-12T12:34:56.789Z'))).toBe('"1973-06-12 12:34:56"');
    });
  });
  describe('encodeIdentifier', () => {
    it('should enclose with backtick', () => {
      expect(encodeIdentifier('hello')).toBe('`hello`');
    });
  });
  describe('encodeLiteral', () => {
    it('should convert nullish to NULL', () => {
      expect(encodeLiteral(null)).toBe('NULL');
      expect(encodeLiteral(undefined)).toBe('NULL');
      expect(encodeLiteral(Number.NaN)).toBe('NULL');
      expect(encodeLiteral(Number.POSITIVE_INFINITY)).toBe('NULL');
      expect(encodeLiteral(Number.NEGATIVE_INFINITY)).toBe('NULL');
    });
    it('should convert string to double-quote enclosed string', () => {
      expect(encodeLiteral('hello')).toBe('"hello"');
      expect(encodeLiteral('he"llo')).toBe('"he\\"llo"');
      expect(encodeLiteral('he""llo')).toBe('"he\\"\\"llo"');
      expect(encodeLiteral('')).toBe('""');
    });
    it('should convert number to string', () => {
      expect(encodeLiteral(123)).toBe('123');
      expect(encodeLiteral(123.456)).toBe('123.456');
    });
    it('should convert boolean to uppcased string', () => {
      expect(encodeLiteral(true)).toBe('TRUE');
      expect(encodeLiteral(false)).toBe('FALSE');
    });
    it('should convert Date to SQL datetime string', () => {
      expect(encodeLiteral(new Date('1973-06-12T12:34:56.789Z'))).toBe('"1973-06-12 12:34:56"');
    });
  });
});
