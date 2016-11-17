# fleek-context

Middleware to parse and bind swagger request information

# Usage

This package is to be used as middleware for [Koa2](https://github.com/koajs/koa/tree/v2.x) to parse swagger documentation and apply it to the `ctx` of the request, while also using the `ctx` to determine which swagger path+method is currently being requested.

# Examples

```javascript
const Koa = require('koa');
const fleekCtx = require('fleek-context');

const SWAGGER = require('./swagger.json');

let app = new Koa();

app.use(fleekCtx(SWAGGER));

app.use((ctx) => {
  console.log(ctx.fleek) // => key, context, swagger
  return Promise.resolve();
});

app.listen(3000);
```

# Documentation

## Middleware

- Accepts
  - Object - parsed swagger documentation
- Returns
  - Middleware for use following the [Koa2](https://github.com/koajs/koa/tree/v2.x) pattern


```javascript
// swagger.json
{
  "basePath": "/v2",
  "paths": {
    "/foo/create": {
      "post": { /* ... */ }
    },
    "/foo/{id}": {
      "get": { /* ... */ }
      "put": { /* ... */ }
      "delete": { /* ... */ }
    }
  }
}
```

```javascript
// app.js
const SWAGGER =require('swagger.json');
let middleware = fleekCtx(SWAGGER);

app.use(middleware);

app.use((ctx) => {
  console.log(ctx.fleek);
  // GET /foo/myID => {
  //   key: 'GET-/foo/{id}',
  //   context: { /* ... */},
  //   swagger: SWAGGER
  // }

  return Promise.resolve();
});

app.listen(3000);
```

# Authors

- [John Hofrichter](github.com/johnhof)
