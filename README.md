fastsql
=======

fast and simple sql builder

![version](https://img.shields.io/github/package-json/v/day1co/fastsql)

## Getting Started

```js
import { SQL } from '@day1co/fastsql';

const table = 'comment';
const postId = 123;
const monthBefore = 1;
const since = () => `DATE_SUB(CURRENT_TIMESTAMP, INTERAVAL ${monthBefore} MONTH)`
const sort = 'likes';

console.log(SQL`
SELECT * FROM ${Symbol.for(table)}
WHERE
  post_id = ${postId} AND
  created_at > ${since}
ORDER BY
  ${Symbol.for(sort)}
`);
// expected:
// SELECT * FROM `table`
// WHERE
//   post_id = 123 AND
//   created_at > DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 MONTH)
// ORDER BY
//   likes
```

## Contributing

### test

```console
$ npm test
```

### build

```console
$ npm run build
```

### watch(continuous build)

```console
$ npm start
```

---
may the **SOURCE** be with you...
