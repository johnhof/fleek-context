'use strict';

const checkpoint = require('./helpers/checkpoint');
const routing = require('./helpers/routing');

class ContextBinder {
  constructor (swagger) {
    checkpoint(swagger, 'Swagger must be provided for context builder')
      .and(swagger.paths, 'Swagger must contain paths for context builder');

    this.swagger = swagger;
    this.basePath = swagger.basePath;
    this.router = routing.compile(swagger.paths);
  }

  bindCtx (ctx={}) {
    let match = this.router.match(ctx.path || '');
    ctx.fleek = {
      context: false,
      params: {},
      swagger: this.swagger
    };

    if (!match) return ctx;
    let context = match && match.node  && match.node[(ctx.method || '').toUpperCase()];
    ctx.fleek.context = context ? context.definition : false,
    ctx.fleek.params = match ? match.param : {}
    return ctx;
  }
}

module.exports = ContextBinder;
