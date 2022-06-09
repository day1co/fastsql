import { MYSQL } from './mysql';

describe('mysql', () => {
  describe('MYSQL', () => {
    it('should work with symbol, function, string, number and date', () => {
      const table = Symbol.for('table');
      const fn = () => 'CURRENT_TIMESTAMP';
      const name = 'name';
      const age = 50;
      const birth = new Date('1973-06-12T12:34:56.789Z');
      expect(MYSQL`SELECT * FROM ${table} WHERE fn=${fn} AND name=${name} AND age=${age} AND birth=${birth}`).toEqual({
        sql: 'SELECT * FROM ?? WHERE fn=CURRENT_TIMESTAMP AND name=? AND age=? AND birth=?',
        values: ['table', name, age, birth],
      });
    });
    it('should work with array for "in" operator', () => {
      const table = Symbol.for('table');
      const name = ['foo', 'bar', 'baz', 'qux'];
      const age = [10, 20, 30];
      const birth = [new Date('1973-06-12T12:34:56.789Z'), new Date('1983-06-12T12:34:56.789Z')];
      expect(MYSQL`SELECT * FROM ${table} WHERE name in ${name} AND age in ${age} AND birth in ${birth}`).toEqual({
        sql: 'SELECT * FROM ?? WHERE name in ? AND age in ? AND birth in ?',
        values: ['table', name, age, birth],
      });
    });
  });
});
