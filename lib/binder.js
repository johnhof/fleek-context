'use strict';

const checkpoint = require('./helpers/checkpoint');
const routing = require('./helpers/routing');

class ContextBinder {
  constructor (swagger) {
    checkpoint(swagger, 'Swagger must be provided for context builder')
      .and(swagger.paths, 'Swagger must contain paths for context builder');

    this.swagger = swagger;
    this.basePath = swagger.basePath;
    this.routeMap = routing.compileMap(this.swagger);
  }

  bindCtx (ctx={}) {
    let key = routing.methodPathToKey(ctx.method, ctx.path)
    ctx.fleek = {
      key: key,
      context: this.routeMap[key] || false,
      swagger: this.swagger
    };
    return ctx;
  }
}

module.exports = ContextBinder;
