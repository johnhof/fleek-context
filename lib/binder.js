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
      swagger: this.swagger,
      method: false,
      path: false
    };

    if (!match) return ctx;
    let node = match && match.node;
    let context = (node ? node[(ctx.method || '').toUpperCase()] : {}) || {};
    ctx.fleek.context = context.definition || false;
    ctx.fleek.params = match ? match.param : {};
    ctx.fleek.method = context.method || false;
    ctx.fleek.path = context.path || false;

    // apply params to ctx.params
    let paramKeys = Object.keys(ctx.fleek.params);
    ctx.params = ctx.params || {};
    for (let param of paramKeys) ctx.params[param] = ctx.params[param] || ctx.fleek.params[param];
    return ctx;
  }
}

module.exports = ContextBinder;
