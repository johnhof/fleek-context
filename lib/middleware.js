'use strict';

const ContextBinder = require('./binder');

module.exports = (swagger) => {
  let binder = new ContextBinder(swagger);
  return (ctx, next) => {
    binder.bindCtx(ctx);
    return next();
  }
}
