import { PG } from './pg';

describe('pg', () => {
  describe('PG', () => {
    it('should work with symbol, function, string, number and date', () => {
      const table = Symbol.for('table');
      const fn = () => 'CURRENT_TIMESTAMP';
      const name = 'name';
      const age = 50;
      const birth = new Date('1973-06-12T12:34:56.789Z');
      expect(PG`SELECT * FROM ${table} WHERE fn=${fn} AND name=${name} AND age=${age} AND birth=${birth}`).toEqual({
        text: 'SELECT * FROM `table` WHERE fn=CURRENT_TIMESTAMP AND name=$1 AND age=$2 AND birth=$3',
        values: [name, age, birth],
      });
    });
    it('should work with array for "in" operator', () => {
      const table = Symbol.for('table');
      const name = ['foo', 'bar', 'baz', 'qux'];
      const age = [10, 20, 30];
      const birth = [new Date('1973-06-12T12:34:56.789Z'), new Date('1983-06-12T12:34:56.789Z')];
      expect(PG`SELECT * FROM ${table} WHERE name in ${name} AND age in ${age} AND birth in ${birth}`).toEqual({
        text: 'SELECT * FROM `table` WHERE name in $1 AND age in $2 AND birth in $3',
        values: [name, age, birth],
      });
    });
  });
});
